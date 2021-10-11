//Credit: https://www.yld.io/blog/global-notifications-with-reacts-context-api/

import useAPIError from '../common/hooks/useApiError.js';
import Toast from 'react-bootstrap/Toast';
import ReactTimeAgo from 'react-time-ago'

function APIErrorNotification() {
  const { error, removeError } = useAPIError();

  const handleSubmit = () => {
    removeError();
  };

  return (
    <Toast className="d-inline-block m-1" bg="danger" autohide onClose={() => handleSubmit()}>
    <Toast.Header>
      <strong className="me-auto">Error</strong>
      <small><ReactTimeAgo date={new Date()} locale="en-US"/></small>
    </Toast.Header>
    <Toast.Body className='text-white'>
      {error}
    </Toast.Body>
  </Toast>
  )
}

export default APIErrorNotification;