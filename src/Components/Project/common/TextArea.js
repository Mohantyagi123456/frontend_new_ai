import React, { useState } from 'react';
import { EuiTextArea } from '@elastic/eui';

const TextArea = () => {
  const [value, setValue] = useState('');
  const onChange = (e) => {
    setValue(e.target.value);
  };

  return (
      <EuiTextArea
        placeholder="Placeholder text"
        aria-label="Use aria labels when no actual label is in use"
        value={value}
        onChange={onChange}
      />
  );
};

export default TextArea;
