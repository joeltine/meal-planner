import Button from '@mui/material/Button';
import PropTypes from 'prop-types';
import React from 'react';

import {tryToConvertStringToType} from '../common/utils';

export class NewRowForm extends React.Component {
  constructor(props) {
    super(props);
    this.values = this.initValues();
    this.inputRefs = this.initInputRefs();
    this.formRef = React.createRef();
    this.state = {validationState: 'needs-validation', validityMessages: {}};
    this.onSaveClick = this.onSaveClick.bind(this);
  }

  onSaveClick() {
    const convertedValues = {};
    const validityMessages = {};
    for (let [key, val] of Object.entries(this.values)) {
      if (val != null) {
        val = val.trim();
      }

      const expectedType = this.props.typeInfo[key];
      const convertedVal = tryToConvertStringToType(val, expectedType);
      if (val === null || !val.length) {
        const msg = `Field cannot be empty`;
        this.inputRefs[key].current.setCustomValidity(msg);
        validityMessages[key] = msg;
      } else if (convertedVal === null || convertedVal === Infinity) {
        const msg = `Cannot convert ${val} to ${expectedType}`;
        this.inputRefs[key].current.setCustomValidity(msg);
        validityMessages[key] = msg;
      } else {
        this.inputRefs[key].current.setCustomValidity('');
        validityMessages[key] = '';
      }
      convertedValues[key] = convertedVal;
    }

    this.setState({
      validityMessages: validityMessages,
      validationState: 'was-validated'
    });

    if (!this.formRef.current.checkValidity()) {
      return;
    }

    this.props.onSaveClick(convertedValues);
  }

  updateValue(key, rawValue) {
    this.values[key] = rawValue;
  }

  buildButtons() {
    return (
        <div className="col-auto" key="formButtons">
          <Button onClick={this.onSaveClick}>Save</Button>
          <Button onClick={this.props.onCancelClick}>Cancel</Button>
        </div>
    );
  }

  buildForm() {
    const cols = [];

    Object.keys(this.props.typeInfo).forEach((key) => {
      // Can't set id as it's auto-generated.
      if (key === 'id') {
        cols.push(
            <div className="col-auto" key={key}>
              <input type="text" className="form-control"
                     placeholder={key}
                     size="4"
                     ref={this.inputRefs[key]}
                     disabled/>
            </div>
        );
      } else {
        // TODO: Change input type based on type info.
        cols.push(
            <div className="col-auto" key={key}>
              <input type="text" className="form-control"
                     placeholder={key}
                     ref={this.inputRefs[key]}
                     onChange={(e) => {
                       this.updateValue(key, e.target.value);
                     }}/>
              <div className="invalid-feedback">
                {this.state.validityMessages[key] || ''}
              </div>
            </div>
        );
      }
    });

    cols.push(this.buildButtons());

    return (
        <form ref={this.formRef} className={this.state.validationState}
              aria-label="new-row-form">
          <div className="row g-2">
            {cols}
          </div>
        </form>
    );
  }

  initValues() {
    const values = {};
    Object.keys(this.props.typeInfo).forEach((key) => {
      values[key] = null;
    });
    return values;
  }

  initInputRefs() {
    const refs = {};
    for (const key in this.props.typeInfo) {
      refs[key] = React.createRef();
    }
    return refs;
  }

  render() {
    return (
        <div className="p-1 border">{this.buildForm()}</div>
    );
  }
}

NewRowForm.propTypes = {
  typeInfo: PropTypes.objectOf(PropTypes.string).isRequired,
  onSaveClick: PropTypes.func,
  onCancelClick: PropTypes.func
};
