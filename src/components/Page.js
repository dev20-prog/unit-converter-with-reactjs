import React, {useRef} from "react"
import ReactToPrint from 'react-to-print'
import units from "../data/units"
import ingredients from "../data/ingredients"
import {nanoid} from "nanoid"

export default function Page() {
    
    const componentRef = useRef()
    
    const [formData, setFormData] = React.useState(
        {
            ingredient: "",
            amount: "",
            from_: "",
            to: ""
        }
    )
    
    const [output, setOutput] = React.useState("")
    
    const [list, setList] = React.useState([])
    
    function roundNum(num) {
        return Math.round(num * 100)/100;
    }
    
    function handleChange(event) {
        setOutput("")
        const {name, value} = event.target
        setFormData(prevFormData => {
            return {
                ...prevFormData,
                [name]: value
            }
        })
    }
    
    function handleSubmit(event) {
        event.preventDefault()
        
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': '2cad3ae734mshb2a704d92f3813fp1290cdjsnc0097051c07b',
                'X-RapidAPI-Host': 'food-unit-of-measurement-converter.p.rapidapi.com'
            }
        }
        
            fetch(`https://food-unit-of-measurement-converter.p.rapidapi.com/convert?unit=${formData.from_}&ingredient=${formData.ingredient}&value=${formData.amount}`, options)
                .then(response => response.json())
                .then(response => response[formData.to])
                .then(response => setOutput(`${formData.ingredient} - ${roundNum(response)} ${formData.to}`))
                .catch(err => alert("500 Server Error"));
    }
    
    function addItem() {
        setList(prevList => {
            return [
                ...prevList,
                {
                    id: nanoid(),
                    item: output
                }
            ]
        })
    }
    
    function removeItem(event, key) {
        setList(prevList => {
            return prevList.filter(item => item.id !== key)
        })
    }
    
    const unitList = units.map(unit => {
        return <option value={unit} key={unit} >{unit}</option>
    })
    
    const ingredientList = ingredients.map(ingredient => {
        return <option value={ingredient} key={ingredient} />
    })
    
    const listElements = list.map(listItem => {
        return <li key={listItem.id}>{listItem.item} <button
            onClick={() => removeItem(listItem.id)}
            className="delete">Remove</button></li>
    })
    
    return (
        <>
            <div className="container">
                <form onSubmit={handleSubmit}>
                    <input
                        list="ingredient-list"
                        id="ingredient"
                        name="ingredient"
                        placeholder="Choose your ingredient"
                        onChange={handleChange}
                        value={formData.ingredient}
                    />
                    <datalist id="ingredient-list">{ingredientList}</datalist>
                    
                    <input
                        type="number"
                        id="amount"
                        name="amount"
                        placeholder="Input amount"
                        onChange={handleChange}
                        value={formData.amount}
                    />
                    
                    <div>
                        <span>
                            <label htmlFor="from"> From: </label>
                            <select
                                id="from"
                                name="from_"
                                onChange={handleChange}
                                value={formData.from_}
                            >
                                <option value="">--Choose--</option>
                                {unitList}
                            </select>
                        </span>
                        <span>
                            <label htmlFor="to"> To: </label>
                            <select
                                id="to"
                                name="to"
                                onChange={handleChange}
                                value={formData.to}
                            >
                                <option value="">--Choose--</option>
                                {unitList}
                            </select>
                        </span>
                    </div>
                    <button>Convert</button>
                </form>
                {output !== "" ?
                    <div className="output">
                        <span>{output} </span>
                        <button onClick={addItem}>Add to List</button>
                    </div> :
                     ""}
            </div>
            <div ref={componentRef}>
                { list.length !== 0 ? "Ingredients List" : ""}
                <ul>
                    {listElements}
                </ul>
            </div>
            <ReactToPrint
                trigger={() => <button className="print">Print</button>}
                content={() => componentRef.current}
                pageStyle={() => ".delete {visibility: hidden}"}
            />
        </>
    )
}