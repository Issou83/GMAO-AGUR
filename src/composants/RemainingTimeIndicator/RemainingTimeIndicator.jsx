import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const RemainingTimeIndicator = ({ remainingHours }) => {
  // const [alarmeWeek, setAlarmeWeek] = (null)
  let percentage = 0;
  let color = 'red';

  if (remainingHours >= 1440) {
    percentage = 100;
    color = 'green';
  } else if (remainingHours >= 720) {
    percentage = 66;
    color = 'orange';
  } else if (remainingHours >= 0) {
    percentage = 33;
  } 
//   useEffect(() => {
//   if (remainingHours < 168) {
//     setAlarmeWeek(true)
//   }
//   return setAlarmeWeek
// })
  return (
    <>
    <CircularProgressbar
      value={percentage}
    //   text={`${remainingHours}h`}
      styles={buildStyles({
        strokeLinecap: 'butt',
        textColor: color,
        pathColor: color,
        trailColor: '#d6d6d6',
      })}
    />
    {/* {alarmeWeek && (<p>Alarme</p>)} */}
    </>
  );
};

export default RemainingTimeIndicator;
