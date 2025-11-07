export const createFormDataReader =
  (formData: FormData) =>
  (key: string, isBoolean: boolean = false) => {
    const value = formData.get(key);
    if (isBoolean) {
      return value === 'on' || value === 'true';
    }
    return value;
  };
