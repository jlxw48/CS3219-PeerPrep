//Credit: https://www.yld.io/blog/global-notifications-with-reacts-context-api/

import { useContext, useState } from 'react';
import useAPIError from '../common/hooks/useApiError.js';
import Toast from 'react-bootstrap/Toast';
import ReactTimeAgo from 'react-time-ago'
import { ErrorContext } from '../App.js';
import { ToastContainer } from 'react-bootstrap';

function APIErrorNotification() {
  const { errors, removeError } = useContext(ErrorContext);

  const closeError = (idx) => {
    removeError(idx);
  };

  let errorToasts = errors.map((err, idx) => {
    return <Toast key={idx} show bg="danger" animation={true} onClose={() => closeError(idx)}>
      <Toast.Header>
        <strong className="me-auto">Error</strong>
        <small><ReactTimeAgo date={new Date()} locale="en-US" /></small>
      </Toast.Header>
      <Toast.Body className='text-white'>
        {err}
      </Toast.Body>
    </Toast>
  })

  return (
    <ToastContainer>
      {errorToasts}
    </ToastContainer>);

}

export default APIErrorNotification;