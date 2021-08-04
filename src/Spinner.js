import React, {Component} from 'react';
import './Spinner.css';

class Spinner extends Component{

    render(){
        return(
            <div className="Spinner">
                <div className="Spinner-fill"></div>
            </div>
        );
    }
}

export default Spinner;