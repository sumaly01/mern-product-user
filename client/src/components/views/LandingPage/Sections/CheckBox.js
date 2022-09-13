import React,{useState} from 'react'
import {Checkbox,Collapse} from 'antd'

const {Panel}=Collapse

/*const continents=[
    {
        "_id":1,
        "name":"Africa"
    },
    {
        "_id":2,
        "name":"Europe"
    },
    {
        "_id":3,
        "name":"Asia"
    },
    {
        "_id":4,
        "name":"South America"
    },
    {
        "_id":5,
        "name":"North America"
    },
    {
        "_id":6,
        "name":"Australia"
    },
    {
        "_id":7,
        "name":"Antarctica"
    }
]

*/

function CheckBox(props) {

    //for all the continents so useState ma array 
    const [Checked,setChecked]=useState([])
    
    const handleToggle=(value)=>{

        {/*Checked:[1,2,3]  -- these are the _id of continents*/}
        const currentIndex= Checked.indexOf(value) 
        {/*otput=0,1... if not then -1 */}
        const newChecked=[...Checked]

        if(currentIndex === -1){
            newChecked.push(value)
        }else{
            newChecked.splice(currentIndex,1)
        }

        setChecked(newChecked)
        
        //parentComponent ie LandingPage ma props through update garne
        props.handleFilters(newChecked)
    }


    const renderCheckboxLists=()=> props.list && props.list.map((value,index)=>(
        <React.Fragment key={index}>
            <Checkbox 
                onChange={()=>handleToggle(value._id)}
                type="checkbox"
                checked={Checked.indexOf(value._id) === -1 ? false : true}
            />
            <span>{value.name}</span>
        </React.Fragment>
    
    ))

    return (
        <div>
            <Collapse defaultActiveKey={['0']}>
                <Panel header="Continents" key="1">
                    {renderCheckboxLists()}
                </Panel>
            </Collapse>
        </div>
    )
}

export default CheckBox
