import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Switch, Route, withRouter } from 'react-router-dom';
import { ipcRenderer } from 'electron';
import * as actions from '../store/actions/actions.js';
import * as events from '../../eventTypes';

import KubectlComponent from '../components/KubectlComponent';
import TreeGraphContainer from './TreeGraphContainer.js';
import CreateMenuItemComponent from '../components/CreateMenuItemComponent';
import SimpleReactValidator from 'simple-react-validator';

const mapStateToProps = store => ({
  roleName: store.aws.roleName,
  pods: store.kubectl.pods,
  deployments: store.kubectl.deployments,
  services: store.kubectl.services,
  showCreateMenuItem: store.navbar.showCreateMenuItem,
  menuItemToShow: store.navbar.menuItemToShow,
});

const mapDispatchToProps = dispatch => ({
  setNewPod: (data) => {
    dispatch(actions.setPod(data))
  },
  setNewDeployment: (data) => {
    dispatch(actions.setDeployment(data))
  },
  setNewService: (data) => {
    dispatch(actions.setService(data))
  },
  toggleCreateMenuItem: () => {
    dispatch(actions.toggleCreateMenuItem())
  }
});

class KubectlContainer extends Component {
  constructor(props) {
    super(props);

    this.validator = new SimpleReactValidator({
      element: (message, className) => <div className="errorClass">{message}</div>
    });

    this.validator1 = new SimpleReactValidator({
      element: (message, className) => <div className="errorClass">{message}</div>
    });

    this.validator2 = new SimpleReactValidator({
      element: (message, className) => <div className="errorClass">{message}</div>
    });

    this.state = {
      pod_podName: '',
      pod_containerName: '',
      pod_imageName: '',

      deployment_deploymentName: '',
      deployment_appName: '',
      deployment_containerName: '',
      deployment_image: '',
      deployment_containerPort: '',
      deployment_replicas: '',

      service_serviceName: '',
      service_appName: '',
      service_port: '',
      service_targetPort: '',

      display_error: false,
    }

    this.handleChange = this.handleChange.bind(this);
    
    this.handleCreatePod = this.handleCreatePod.bind(this);
    this.handleNewPod = this.handleNewPod.bind(this);

    this.handleCreateDeployment = this.handleCreateDeployment.bind(this);
    this.handleNewDeployment = this.handleNewDeployment.bind(this);

    this.handleCreateService = this.handleCreateService.bind(this);
    this.handleNewService = this.handleNewService.bind(this);

    this.testFormValidation = this.testFormValidation.bind(this);
  }

  //**--------------COMPONENT LIFECYCLE METHODS-----------------**//
  
  // DEPLOYMENT LIFECYCLE METHOD
  componentDidMount() {
    ipcRenderer.on(events.HANDLE_NEW_POD, this.handleNewPod)
    ipcRenderer.on(events.HANDLE_NEW_SERVICE, this.handleNewService)
    ipcRenderer.on(events.HANDLE_NEW_DEPLOYMENT, this.handleNewDeployment)
  }
  
  // On component unmount, we will unsubscribe to listeners
  componentWillUnmount() {
    ipcRenderer.removeListener(events.HANDLE_NEW_POD, this.handleNewPod);
    ipcRenderer.removeListener(events.HANDLE_NEW_SERVICE, this.handleNewService);
    ipcRenderer.removeListener(events.HANDLE_NEW_DEPLOYMENT, this.handleNewDeployment);
  }

  //**--------------EVENT HANDLERS-----------------**//

  //HANDLE CHANGE METHOD FOR FORMS
  handleChange(e) {
    e.preventDefault();
    const newState = this.state;
    newState[e.target.id] = e.target.value;
    this.setState(newState);
  };

  testFormValidation() {
    if (this.validator.allValid()) {
      alert('Your pod is being created!');
      return true;
    } else {
      this.validator.showMessages();
      this.forceUpdate();
      return false;
    }
  }

  testFormValidation1() {
    if (this.validator1.allValid()) {
      alert('Your deployment is being created!');
      return true;
    } else {
      this.validator1.showMessages();
      this.forceUpdate();
      return false;
    }
  }

  testFormValidation2() {
    if (this.validator2.allValid()) {
      alert('Your service is being created!');
      return true;
    } else {
      this.validator2.showMessages();
      this.forceUpdate();
      return false;
    }
  }


  //CREATE POD HANDLER
  handleCreatePod(data) {
    console.log('handleCreatePod Clicked!!!');

    const obj = {
      podName: this.state.pod_podName,
      containerName: this.state.pod_containerName,
      imageName: this.state.pod_imageName,
    }

    if (this.testFormValidation()) {
      console.log("All form data passed validation");
      ipcRenderer.send(events.CREATE_POD, obj);
    } else {
      console.log("Invalid or missing data entry");
    }
  }

  //CREATE DEPLOYMENT HANDLER
  handleCreateDeployment(data) {
    console.log('handleCreateDeployment Clicked!!!');
    const obj = {
      deploymentName: this.state.deployment_deploymentName,
      appName: this.state.deployment_appName,
      containerName: this.state.deployment_containerName,
      image: this.state.deployment_image,
      containerPort: this.state.deployment_containerPort,
      replicas: this.state.deployment_replicas
    }

    if (this.testFormValidation1()) {
      console.log("All form data passed validation");
      ipcRenderer.send(events.CREATE_DEPLOYMENT, obj);
    } else {
      console.log("Invalid or missing data entry");
    }
  }

  //CREATE SERVICE HANDLER
  handleCreateService(data) {
    console.log('handleCreateService Clicked!!!');
    const obj = {
      name: this.state.service_serviceName,
      appName: this.state.service_appName,
      port: this.state.service_port,
      targetPort: this.state.service_targetPort
    }
    if (this.testFormValidation2()) {
      console.log("All form data passed validation");
      ipcRenderer.send(events.CREATE_SERVICE, obj);
    }
    console.log("Invalid or missing data entry");
  }

  //**--------------INCOMING DATA FROM MAIN THREAD-----------------**//

  //INCOMING POD DATA
  handleNewPod(event, data) {
    // The following is going to be the logic that occurs once a new role was created via the main thread process
    console.log('incoming text:', data);
    const obj = {
      podName: this.state.pod_podName,
      containerName: this.state.pod_containerName,
      imageName: this.state.pod_imageName,
    }    
    this.props.setNewPod(obj);
    const newState = this.state;
    newState.pod_podName = '';
    newState.pod_containerName = '';
    newState.pod_imageName = '';
    this.setState(newState);
  }

  //INCOMING DEPLOYMENT DATA 
  handleNewDeployment(event, data) {
    // The following is going to be the logic that occurs once a new role was created via the main thread process
    console.log('incoming text:', data);
    const obj = {
      deploymentName: this.state.deployment_deploymentName,
      appName: this.state.deployment_appName,
      containerName: this.state.deployment_containerName,
      image: this.state.deployment_image,
      containerPort: this.state.deployment_containerPort,
      replicas: this.state.deployment_replicas
    }    
    this.props.setNewDeployment(obj);
    const newState = this.state;
    newState.deployment_deploymentName = '';
    newState.deployment_appName = '';
    newState.deployment_containerName = '';
    newState.deployment_image = '';
    newState.deployment_containerPort = '';
    newState.deployment_replicas = '';
    this.setState(newState);
  }


  //INCOMING SERVICE DATA
  handleNewService(event, data) {
    // The following is going to be the logic that occurs once a new role was created via the main thread process
    console.log('incoming text:', data);
    const obj = {
      name: this.state.service_serviceName,
      appName: this.state.service_appName,
      port: this.state.service_port,
      targetPort: this.state.service_targetPort
      //containerName: this.state.service_containerName,
      //image: this.state.service_image,
      //replicas: this.state.service_replicas
    }    
    this.props.setNewService(obj);
    const newState = this.state;
    newState.service_serviceName = '';
    newState.service_appName = '';
    newState.service_port = '';
    newState.service_targetPort = ';'
    //newState.service_containerName = '';
    //newState.service_image = '';
    //newState.service_replicas = '';
    this.setState(newState);
  }

  render() {
    return (
      <div className='kubectl_container'>
        {/* <KubectlComponent
          handleChange={this.handleChange}
          validator={this.validator}
          validator1={this.validator1}
          validator2={this.validator2}

          handleCreatePod={this.handleCreatePod}
          handleCreateDeployment={this.handleCreateDeployment}
          handleCreateService={this.handleCreateService}

          pod_podName={this.state.pod_podName}
          pod_containerName={this.state.pod_containerName}
          pod_imageName={this.state.pod_imageName}

          deployment_deploymentName={this.state.deployment_deploymentName}
          deployment_appName={this.state.deployment_appName}
          deployment_containerName={this.state.deployment_containerName}
          deployment_image={this.state.deployment_image}
          deployment_containerPort={this.state.deployment_containerPort}
          deployment_replicas={this.state.deployment_replicas}

          service_serviceName={this.state.service_serviceName}
          service_appName={this.state.service_appName}
          service_port={this.state.service_port}
          service_targetPort={this.state.service_targetPort}


          //ToDO: Delete these elements if not in use
          //service_containerName={this.state.service_containerName
          //service_image={this.state.service_image}
          //service_replicas={this.state.service_replicas}

          pods={this.props.pods}
          deployments={this.props.deployments}
          services={this.props.services}
        /> */}
        {this.props.showCreateMenuItem === true && (
          <CreateMenuItemComponent
            menuItemToShow={this.props.menuItemToShow}
            toggleCreateMenuItem={this.props.toggleCreateMenuItem}
            handleCreateDeployment={this.handleCreateDeployment}
            handleChange={this.handleChange}

            validator1={this.validator1}
            
            deployments={this.props.deployments}
            deployment_deploymentName={this.state.deployment_deploymentName}
            deployment_appName={this.state.deployment_appName}
            deployment_containerName={this.state.deployment_containerName}
            deployment_image={this.state.deployment_image}
            deployment_containerPort={this.state.deployment_containerPort}
            deployment_replicas={this.state.deployment_replicas}
          />
        )}
        <TreeGraphContainer 

        />
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(KubectlContainer))