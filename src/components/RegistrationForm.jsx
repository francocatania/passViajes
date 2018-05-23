import React from 'react';
import { Form, Input, Tooltip, Icon, Button, message } from 'antd';
import { send } from 'emailjs-com/dist/email.js';
import { serviceID, templateID, userID } from '../emailjs-config';

const { TextArea } = Input;
const FormItem = Form.Item;

class RegistrationForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmDirty: false,
      isLoading: false
    }
  }

  setLoading(bool) {
    this.setState({ isLoading: bool });
  }

  handleSubmit = (e) => {
    this.setLoading(true);
    const setLoading = this.setLoading.bind(this);
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        send(serviceID, templateID, values, userID)
        .then(function(response) {
          setLoading(false);
          message.success('Mail enviado correctamente.');
        }, function(error) {
          setLoading(false);
          message.error('Hubo un error, vuelva a intentarlo más tarde.');
       });
      } else {
        setLoading(false);
      }
    });
  }

  handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }
  
  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <Form layout='vertical' onSubmit={this.handleSubmit} className="antdForm">
        
        <FormItem label="Nombre y Apellido">
          {getFieldDecorator('name')(
            <Input />
          )}
        </FormItem>

        <FormItem label="E-mail">
          {getFieldDecorator('email', {
            rules: [{
              type: 'email', message: 'Este no es un Email válido',
            }, {
              required: true, message: 'Por favor ingrese su mail',
            }],
          })(
            <Input />
          )}
        </FormItem>
        
        <FormItem
          label={(
            <span>
              Teléfono&nbsp;
              <Tooltip title={`Prefiere que lo llamemos?
              Solo válido para números dentro de Argentina`}>
                <Icon type="question-circle-o" />
              </Tooltip>
            </span>
          )}
        >
          {getFieldDecorator('phone')(
            <Input addonBefore='+54' style={{ width: '100%' }} />
          )}
        </FormItem>

        <FormItem label="Consulta">
          {getFieldDecorator('text', {
            rules: [{ type: 'string', required: false}],
            })(
              <TextArea 
              rows={5}
              placeholder="Escriba su consulta, no olvide indicar la fecha del traslado, la hora y la cantidad de pasajeros"
              />
          )}
        </FormItem>
        
        <FormItem >
          <Button type="primary" htmlType="submit" loading={this.state.isLoading}>Enviar</Button>
        </FormItem>
      </Form>
    );
  }
}

const WrappedRegistrationForm = Form.create()(RegistrationForm);

export default WrappedRegistrationForm;
