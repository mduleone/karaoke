import { useState, useRef, useEffect, type RefObject } from 'react';
import { ArtistType, SongType } from '../types/song';

const isArtists = (candidate): candidate is ArtistType[] =>
  candidate.every((cand) => ['artist', 'songs'].every((key) => key in cand));

const useAlphabetScroller = (sortedList: SongType[] | ArtistType[], byTitle: boolean = false) => {
  const letterRefMap = useRef<Record<string, HTMLElement[]>>({});
  const [lettersMapState, setLettersMapState] = useState<string[]>([]);

  useEffect(() => {
    if (sortedList.length === 0) {
      letterRefMap.current = {};
      setLettersMapState([]);
      return;
    }

    if (isArtists(sortedList)) {
      const list = sortedList.reduce((map, { artist }) => {
        const letter = artist[0].toLocaleUpperCase();
        if (/[0-9]/.test(letter)) {
          map['#'] = [];
        } else {
          map[letter] = [];
        }

        return map;
      }, {});
      letterRefMap.current = list;
      setLettersMapState(Object.keys(list).toSorted());
      return;
    }

    const list = sortedList.reduce((map, { artist, title }) => {
      const sortKey = byTitle ? title : artist;
      const letter = sortKey.charAt(0).toLocaleUpperCase();
      if (/[0-9]/.test(letter)) {
        map['#'] = [];
      } else {
        map[letter] = [];
      }

      return map;
    }, {});
    letterRefMap.current = list;
    setLettersMapState(Object.keys(list).toSorted());
  }, [sortedList, byTitle]);

  const addToRefMap = (name: string) => (instance: HTMLElement) => {
    const letter = name.charAt(0).toLocaleUpperCase();
    if (/[0-9]/.test(letter)) {
      instance && letterRefMap.current['#']?.push(instance);
      return;
    }
    instance && letterRefMap.current[letter]?.push(instance);
  };

  return { lettersRefMap: letterRefMap.current, addToRefMap, lettersMapState };
};

export default useAlphabetScroller;
