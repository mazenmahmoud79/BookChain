import React, { useHistory } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit } from '@fortawesome/free-solid-svg-icons';
import './MainAdmin.css';

const MainAdmin = () => {
  const history = useHistory(); // Initialize the useHistory hook

  const handleAddEventClick = () => {
    history.push('/admin'); // Navigate to the Admin component when the Add Event icon is clicked
  };

  return (
    <div className="event-icons-container">
      <div className="event-icon" onClick={handleAddEventClick}> {/* Add the click handler */}
        <FontAwesomeIcon icon={faPlus} size="2x" className="event-icon-image" />
        <p>Add Event</p>
      </div>
      <div className="event-icon">
        <FontAwesomeIcon icon={faEdit} size="2x" className="event-icon-image" />
        <p>Update Event</p>
      </div>
    </div>
  );
};

export default MainAdmin;
