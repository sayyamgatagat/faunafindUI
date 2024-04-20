import PropTypes from 'prop-types';

const Progress = ({ similarity }) => {
//   const progressValue = Math.round(similarity * 100); // Assuming similarity is a value between 0 and 1
  let barColorClass;

  if (similarity <= 25) {
    barColorClass = 'bg-danger'; // Red color for low percentages
  } else if (similarity <= 40) {
    barColorClass = 'bg-warning'; // Yellow color for moderate percentages
  } else if (similarity <= 60) {
    barColorClass = 'bg-info'; // Blue color for higher percentages
  } else {
    barColorClass = 'bg-success'; // Green color for highest percentages
  }

  return (
    <div className="progress">
      <div
        className={`progress-bar ${barColorClass}`}
        role="progressbar"
        style={{ width: `${similarity}%` }}
        aria-valuenow={similarity}
        aria-valuemin={0}
        aria-valuemax={100}
      >
       Similarity: {similarity}%
      </div>
    </div>
  );
};

Progress.propTypes = {
  similarity: PropTypes.number.isRequired,
};

export default Progress;
