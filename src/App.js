import { useState } from "react";
import { useEffect } from "react";
import dataHandler from "./dataHandler";
import axios from 'axios'

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNum, setNum] = useState("");
  const [filtered, setFiltered] = useState(persons);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    
    console.log("useEffect triggered");

    dataHandler.getAll().then((response) => {

      console.log("noudettu");
      setPersons(response);
      console.log(response);

    });
  }, []);

  function readtextfield(e) {
    setNewName(e.target.value);
  }

  function readNumber(e) {
    setNum(e.target.value);
  }

  function deletePerson(id) {
    if (window.confirm("Delete this person?")) {
      console.log(dataHandler.remove(id))

      dataHandler.getAll().then(response => {
        setPersons(persons.filter(person => person.id !==id))
      })
    }
  }

  function enterPerson(e) {
    e.preventDefault();
    let sama = false;
    const newPerson = { name: newName, number: newNum };


    persons.map((element) => {
      console.log(element.name);

      if (element.name.toLowerCase() == newName.toLowerCase()) {
        console.log(element.name.toLowerCase == newName.toLowerCase);
        sama = true;
      }

    });

    if (!sama) {

      dataHandler.create(newPerson).then((response) => {
        console.log("AAAAA");
        setPersons(persons.concat(response));});

    } else {

      if (window.confirm(newName + " already exists in the database. are you trying to update a number?")) {

        let id = -1;

        persons.forEach(person => {
          if (person.name === newName) {id = person.id}
        })

        dataHandler.update(newPerson, id).then(response=>{
          console.log(response);
        }).catch(e => {
          setMessage("Number update failed :CCCC");

          setTimeout(()=> {
            setMessage(null)
          }, 5000)
        })
      }
    }

    setMessage("Person added :)");

    setTimeout(() => {
      setMessage(null);
    }, 5000)

  }

  function filterPeople(e) {
    setFiltered(
      persons.filter((person) =>
        person.name.toLowerCase().includes(e.target.value.toLowerCase())
      )
    );
  }

  return (
    <div>
      <h2>Phonebook</h2>

      <Message message={message}/>

      <Search query={filterPeople} />
      <br />

      <Form text={readtextfield} num={readNumber} sub={enterPerson} />

      <h2>Numbers</h2>
      <h3>All</h3>
      <List people={persons} deletePerson={deletePerson}/>

      <h3>Filtered</h3>
      <List people={filtered} deletePerson={deletePerson}/>
    </div>
  );
};

const Search = (props) => {
  return (
    <>
      Search people: <input onChange={props.query} />
    </>
  );
};

const Form = (props) => {
  return (
    <>
      Name: <input onChange={props.text} /> <br />
      Number: <input onChange={props.num} /> <br />
      <button type="submit" onClick={props.sub}>
        add
      </button>
    </>
  );
};

const List = (props) => {
  return (
    <ul>
      {props.people.map(function (person) {
        return <li key={person.id}>{person.name + " - " + person.number} <button onClick={() => props.deletePerson(person.id)}>Delete</button></li>;
      })}
    </ul>
  );
};

const Message = ({message}) => {
  if (message === null) {
    return(
      <>
      </>
    )
  }

  return (
    <div className="error">
      {message}
    </div>
  )
}

export default App;
