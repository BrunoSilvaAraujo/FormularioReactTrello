import React, { useState } from 'react';
import './form.css';
import {  Row, Col, Button, Form, FormGroup, Label, Input, Container, Alert } from 'reactstrap';

const initialValue = {
  nome: "",
  email: "",
  text: "",
  options: [],
  select: "",
  tags: [],
};
const FormTrello = () => {
  const [valuesForm, setValuesForm] = useState(initialValue);
  const [checked_1, setChecked_1] = useState(false);
  const [checked_2, setChecked_2] = useState(false);
  const [checked_3, setChecked_3] = useState(false);

  const recebeDadosTags = (id) => {
    let idMinuscula = id.toLowerCase();

    if (
      document.getElementById(idMinuscula).style.backgroundColor ==
      "rgb(162, 219, 252)"
    ) {
      document.getElementById(idMinuscula).style.backgroundColor = "white";
      valuesForm.tags.splice(valuesForm.tags.indexOf(id), 1);
    } else {
      document.getElementById(idMinuscula).style.backgroundColor =
        "rgb(162, 219, 252)";
      valuesForm.tags.push(id);
    }
    setValuesForm({ ...valuesForm });
  };

  const carregaDadosForm = (evt) => {
    const { name, value } = evt.target;
    if (name == "inputOpt-1") {
      setChecked_1(!checked_1);
      if (!checked_1 == true) {
        valuesForm.options.push("opção 1");
      } else {
        valuesForm.options.splice(valuesForm.options.indexOf(name), 1);
      }
    }
    if (name == "inputOpt-2") {
      setChecked_2(!checked_2);
      if (!checked_2 == true) {
        valuesForm.options.push("opção 2");
      } else {
        valuesForm.options.splice(valuesForm.options.indexOf(name), 1);
      }
    }
    if (name == "inputOpt-3") {
      setChecked_3(!checked_3);
      if (!checked_3 == true) {
        valuesForm.options.push("opção 3");
      } else {
        valuesForm.options.splice(valuesForm.options.indexOf(name), 1);
      }
    }
    const objectValueForm = { ...valuesForm, [name]: value };
    delete valuesForm["inputOpt-1"];
    delete valuesForm["inputOpt-2"];
    delete valuesForm["inputOpt-3"];
    setValuesForm(objectValueForm);
  };

  const onsubmit = (evt) => {
    evt.preventDefault();
    if (validate(valuesForm).length > 0 ) {
        document.getElementById('alerta').style.display = "block"
        validate(valuesForm).map( item  => {
            if ( item == ".label-tags" ) {
                document.querySelectorAll(item).forEach( element => {
                    element.style.borderColor = 'rgba(230, 39, 39, 0.562)'
                })
            }else if ( item.slice( 0, 5 ) == 'check') {
                document.getElementById(item).style.color = 'rgba(230, 39, 39, 0.562)'
            }else if ( item != ".label-tags" ) {
                document.getElementById(item).style.border = '1px solid rgba(230, 39, 39, 0.562)'
            }
        })
      return 
    } else {
      // a { key } e o { token } estã sendo deixadas aqui par fins de testes
      let url = `https://api.trello.com/1/cards?key=44131a793f2e57943e8dccc1b7746e6e&token=2fc144ee87088bf3baac4264ed47acc483f9cb2d2a4000b67ea8c2dfe5ac68bd&idList=5feb453f039e128041f9c552&name=${valuesForm.nome}&desc={ Text Area }: ${valuesForm.text}...{ Email }: ${valuesForm.email}...{ Opções }: ${valuesForm.options}...{ Select }: ${valuesForm.select}...{ Tags }: ${valuesForm.tags}&due=2020-12-31&color=red&pos=top`;
      fetch(url, {
        method: "POST",
      })
        .then((response) => {
          valuesForm.tags.map((item) => {
            let id = item.toLowerCase();
            document.getElementById(id).style.backgroundColor = "white";
          });
          setChecked_1(false)
          setChecked_2(false)
          setChecked_3(false)
          document.getElementById("formulario").reset();
          setValuesForm({
            nome: "",
            email: "",
            text: "",
            options: [],
            select: "",
            tags: [],
          })
          return response.text();
        })
        .then((text) => console.log(text))
        .catch((err) => console.error(err));
    }
  };

  const validate = (values) => {
    let regNumeros = new RegExp("[0-9#@$%!&=*+]", "g");
    let regEmail1 = new RegExp(/^[a-z0-9._]+@[a-z0-9]+\.[a-z]+\.[a-z]+?$/i);
    let regEmail2 = new RegExp(/^[a-z0-9._]+@[a-z0-9]+\.[a-z]+?$/i);
    let regEmail3 = new RegExp(
      "[A-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ#$%!&=*+]",
      "g"
    );

    const error = []

    if (
      regNumeros.test(values.nome) ||
      values.nome == "" ||
      values.nome.length < 2
    ) {
      error.push("inputNome");
    }
    if (
      (!regEmail1.test(values.email) &&
        !regEmail2.test(values.email) &&
        values.email != "") ||
      (regEmail3.test(values.email) && values.email != "") ||
      values.email == ""
    ) {
      error.push("inputEmail");
    }
    if (values.options.length == 0 || values.options == []) {
      error.push("check-1")
      error.push("check-2")
      error.push("check-3")
    }
    if (values.tags.length == 0 || values.tags == []) {
      error.push(".label-tags");
    }
    if (values.text == "" || typeof values.text == undefined) {
      error.push("textArea");
    }

    return error;
  };
  const retiraErro = () => {
    validate(valuesForm).map( item  => {
        if ( item == ".label-tags" ) {
            document.querySelectorAll(item).forEach( element => {
                element.style.borderColor = 'rgb(4, 162, 253)'
            })
        }else if ( item.slice( 0, 5 ) == 'check') {
            document.getElementById(item).style.color = 'rgb(4, 162, 253)'
        }else if ( item != ".label-tags" ) {
            document.getElementById(item).style.border = '1px solid rgb(4, 162, 253)'
        }
    })
    document.getElementById('alerta').style.display = 'none'
  }

  return (
    <Container>
      <Alert id="alerta" color="danger">
        <strong>campos com erro: </strong> Por favor, não pode haver campo de texto vazio ou fora de padrão de preenchimento, selecione ao menos uma opção dos campos selecionáveis !
        <Label type="buttom" id="retira-erro" onClick={retiraErro}>X</Label>
      </Alert>
      <Form form onSubmit={onsubmit} id="formulario">
        <Row xs="2" sm="16" id="linha-1">
          <FormGroup>
            <Label for="nome">Nome</Label>
            <Input
              type="text"
              name="nome"
              id="inputNome"
              placeholder="Nome"
              onChange={carregaDadosForm}
            />
          </FormGroup>
          <Row id="check" xs="12" sm="12">
            <FormGroup check sm="4">
              <Label for="inputOpt-1" id="check-1">
                <Input
                  checked={checked_1}
                  name="inputOpt-1"
                  type="checkbox"
                  id="inputOpt-1"
                  onChange={carregaDadosForm}
                />
                Opção 1
              </Label>
            </FormGroup>
            <FormGroup sm="4">
              <Label for="inputOpt-2" id="check-2">
                <Input
                  checked={checked_2}
                  name="inputOpt-2"
                  type="checkbox"
                  id="inputOpt-2"
                  onChange={carregaDadosForm}
                />{" "}
                Opção 2
              </Label>
            </FormGroup>
            <FormGroup sm="4">
              <Label for="inputOpt-3" id="check-3">
                <Input
                  checked={checked_3}
                  name="inputOpt-3"
                  type="checkbox"
                  id="inputOpt-3"
                  onChange={carregaDadosForm}
                />{" "}
                Opção 3
              </Label>
            </FormGroup>
          </Row>
        </Row>
        <Row id="linha-2" xs="2" sm="2">
          <FormGroup sm="1">
            <Label for="inputEmail">Email</Label>
            <Input
              type="email"
              name="email"
              id="inputEmail"
              placeholder="email@email.com"
              onChange={carregaDadosForm}
            />
          </FormGroup>
          <FormGroup sm="1">
            <Input
              type="select"
              name="select"
              id="select"
              onChange={carregaDadosForm}
            >
              <option>Select 1</option>
              <option>Select 2</option>
              <option>Select 3</option>
            </Input>
          </FormGroup>
        </Row>
        <Row id="linha-3" xs="2" sm="2">
          <FormGroup id="container-text-area" md="10">
            <Label id="text-area" for="text">
              Text Area
            </Label>
            <Input
              type="textarea"
              name="text"
              id="textArea"
              placeholder="Escreva alguma coisa"
              onChange={carregaDadosForm}
            />
          </FormGroup>
          <Row id="linha-3-col-2" sm="12">
            <Col md="8" id="col-tags">
              <Label id="titulo-tags">Tags</Label>
              <Row md="5">
                <Button
                  type="button"
                  id="web"
                  onClick={() => recebeDadosTags("Web")}
                  size="sm"
                  outline
                  color="primary"
                  className="label-tags"
                >
                  Web
                </Button>
                <Button
                  type="button"
                  id="illustration"
                  onClick={() => recebeDadosTags("Illustration")}
                  size="sm"
                  outline
                  color="primary"
                  className="label-tags"
                >
                  Illustration
                </Button>
                <Button
                  type="button"
                  id="graphics"
                  onClick={() => recebeDadosTags("Graphics")}
                  size="sm"
                  outline
                  color="primary"
                  className="label-tags"
                >
                  Graphics
                </Button>
                <Button
                  type="button"
                  id="ui"
                  onClick={() => recebeDadosTags("Ui")}
                  size="sm"
                  outline
                  color="primary"
                  className="label-tags"
                >
                  Ui
                </Button>
              </Row>
              <Row md="5">
                <Button
                  id="design"
                  onClick={() => recebeDadosTags("Design")}
                  size="sm"
                  outline
                  color="primary"
                  className="label-tags"
                >
                  Design
                </Button>
                <Button
                  id="app"
                  onClick={() => recebeDadosTags("App")}
                  size="sm"
                  outline
                  color="primary"
                  className="label-tags"
                >
                  App
                </Button>
                <Button
                  id="iphone"
                  onClick={() => recebeDadosTags("Iphone")}
                  size="sm"
                  outline
                  color="primary"
                  className="label-tags"
                >
                  Iphone
                </Button>
                <Button
                  id="interface"
                  onClick={() => recebeDadosTags("Interface")}
                  size="sm"
                  outline
                  color="primary"
                  className="label-tags"
                >
                  Interface
                </Button>
              </Row>
              <Row md="3">
                <Button
                  id="icon"
                  onClick={() => recebeDadosTags("Icon")}
                  size="sm"
                  outline
                  color="primary"
                  className="label-tags"
                >
                  Icon
                </Button>
                <Button
                  id="web design"
                  onClick={() => recebeDadosTags("Web Design")}
                  size="sm"
                  outline
                  color="primary"
                  className="label-tags"
                >
                  Web Design
                </Button>
              </Row>
            </Col>
            <Col md="4" id="btn-submit">
              <Button color="primary">Submit</Button>
            </Col>
          </Row>
        </Row>
      </Form>
    </Container>
  );
};

export default FormTrello;

