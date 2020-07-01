import React, { Component } from "react";
import { SaveBtn } from "../components/Buttons/index"
import Jumbotron from "../components/Jumbotron";
import API from "../utils/API";
import { Link } from "react-router-dom";
import { Col, Row, Container } from "../components/Grid";
import { List } from "../components/List";
import { Input, FormBtn, Dropdown, Option } from "../components/Form";


class User extends Component {
    state = {
        userInfo: {},
        workouts: [],
        movements: [],
        workoutType: "",
        rounds: "",
        movementName: "",
        reps: "",
        weight: "",
        movementArray:[],
        repsArray:[],
        weightsArray: [],
        minutes: "",
        seconds: ""
    };

    componentDidMount() {
        const userName = this.props.match.params.name
        this.getMovements()
        this.loadUser(userName)

    }
    getMovements = () => {
        API.getMovements()
            .then(res => {
                this.setState({ movements: res.data })
            })
            .catch(err => console.log(err));
    }
    loadUser = userName => {
        API.getUser(userName)
            .then(res => {
                console.log(res.data.workouts)
                this.setState({
                    userInfo: res.data, workouts: res.data.workouts, workoutType: "",
                    rounds: "",
                    movementName: "",
                    reps: "",
                    weight: "",
                    minutes: "",
                    seconds: ""
                })

            })
            .catch(err => console.log(err));
    }
    handleInputChange = event => {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });
    };
    addMovement = event => {
        const movement = {name:this.state.movementName,reps:this.state.reps,weight:this.state.weight}
        const movementArray = this.state.movementArray
        movementArray.push(movement)
        console.log(movementArray)
        this.setState({movementArray:movementArray,movementName:"",reps:"",weight:""})
    }
    handleFormSubmit = event => {
        event.preventDefault();
        let time = parseInt(this.state.minutes) * 60 + parseInt(this.state.seconds);
        API.saveWorkouts({
            workoutType: this.state.workoutType,
            rounds: this.state.rounds,
            movements: this.state.movementArray,    
        },
        {userName:this.state.userInfo.userName,
         score: time
        }
        ).then(res => this.loadUser(this.state.userInfo.userName))
            .catch(err => console.log(err));
    }

    render() {
        return (
            <div className="container">
            <Container fluid>
                <Row>
                    <Col size="md-6">
                        <Jumbotron>
                            <h1>{this.state.userInfo.firstName} {this.state.userInfo.lastName}</h1>
                        </Jumbotron>
                        {this.state.workouts.length ? (
                            <List>
                                {this.state.workouts.map(workout => (
                                    <Row key={workout._id}>
                                        <Col size="md-2">
                                            {workout.workoutType}
                                        </Col>
                                        <Col size="md-2">

                                            Time: {Math.floor(workout.time / 60)}:{workout.time % 60}
                                        </Col>
                                        <Col size="md-2">
                                            Rounds: {workout.rounds}
                                        </Col>
                                        <Col size="md-2">
                                            {workout.movements.map(movement=>(
                                                <p>
                                                    {movement.reps}x{movement.name}at{movement.weight}
                                                </p>
                                            ))}
                                        
                                            
                                        </Col>

                                    </Row>
                                ))}
                            </List>
                        ) : (<h3>Future Workouts Go Here </h3>)}

                    </Col>
                    <Col size="md-6">

                        <Jumbotron>
                            <h1>Stats Go here</h1>
                        </Jumbotron>

                        
                        <h3>Log a Workout </h3>
                        <form>
                            <Row>
                                <label htmlFor="workoutType">Workout Type</label>
                                <Dropdown
                                    value={this.state.workoutType}
                                    onChange={this.handleInputChange}
                                    name="workoutType"
                                    placeholder="Workout Type"
                                >

                                    <Option selected disabled value="" name="Workout" />
                                    <Option name="For Time" />
                                    <Option name="AMRAP" />
                                    <Option name="Tabata" />

                                </Dropdown>

                            </Row>
                            <Container>
                                <Row>
                                    <Input
                                        value={this.state.rounds}
                                        onChange={this.handleInputChange}
                                        name="rounds"
                                        placeholder={this.state.workoutType === "For Time" ? "Rounds" : "Time"}
                                    />
                                </Row>
                                <Row>
                                    <label htmlFor="movementName">Movement:</label>
                                    <Dropdown
                                        value={this.state.movementName}
                                        onChange={this.handleInputChange}
                                        name="movementName"
                                        placeholder="Movement"
                                    >
                                        <Option selected disabled value="" name="Choose Movement"/>
                                        {this.state.movements.map(movement => ( 
                                            <Option name={movement.name} key={movement._id}/>
                                        ))}
                                    </Dropdown>
                                    <Input
                                        value={this.state.reps}
                                        onChange={this.handleInputChange}
                                        name="reps"
                                        placeholder="Reps"
                                    />
                                    <Input
                                        value={this.state.weight}
                                        onChange={this.handleInputChange}
                                        name="weight"
                                        placeholder="weight"
                                        
                                    />
                                    <SaveBtn onClick={()=> this.addMovement()}/>
                                
                                </Row>
                                {this.state.movementArray.length ? (
                                    <List>
                                        
                                        {this.state.movementArray.map(movement=> (
                                        <Row>
                                            <Col size="md-4">
                                                <p>Movement:{movement.name}</p>
                                            </Col>
                                            <Col size="md-4">
                                                <p>Reps:{movement.reps}</p>
                                            </Col>
                                            <Col size="md-4">
                                                <p>Weight:{movement.weight}</p>
                                            </Col>
                                        
                                        </Row>
                                        ))}
                                     </List>
                                ):("")}
                                
                                <Row>
                                    <h5>{this.state.workoutType === "For Time" ? "Time: " : "Score: "}</h5>
                                    <Input
                                        value={this.state.minutes}
                                        onChange={this.handleInputChange}
                                        name= "minutes"
                                        placeholder={this.state.workoutType==="For Time" ? "Minutes" : "Rounds"}
                                    />
                                    <h3>{this.state.workoutType === "For Time" ? " : " : " + "}</h3>
                                    <Input
                                        value={this.state.seconds}
                                        onChange={this.handleInputChange}
                                        name="seconds"
                                        placeholder={this.state.workoutType === "For Time" ? "Seconds" : "Reps"}
                                    />
                                </Row>


                                <FormBtn
                                    disabled={!(this.state.workoutType && this.state.rounds)}
                                    onClick={this.handleFormSubmit}
                                >
                                    Log Workout
                            </FormBtn>
                            </Container>

                        </form>

                    </Col>
                </Row>
            </Container>
            
            </div>
        );
    }
}

export default User
