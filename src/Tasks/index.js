import React from 'react';

const Tasks = function(props) {
  return (
      <div className={'section ' + props.className}>
        <div className="header">{props.header}</div>
        <div className="items">
          {props.children}
        </div>
      </div>
  );
};

export default Tasks;