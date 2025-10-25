'use client';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './ToastProvider.module.scss';

const ToastProvider = () => (
  <ToastContainer
    position="bottom-center"
    hideProgressBar
    pauseOnFocusLoss={false}
    autoClose={3000}
    toastClassName={styles.toastContainer}
  />
);

export default ToastProvider;
