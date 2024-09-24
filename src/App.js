import { useEffect, useState } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

import TodoBoard from "./components/TodoBoard";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";

import api from "./utils/api";

function App() {
  const [todoList, setTodoList] = useState([]);
  const [todoValue, setTodoValue] = useState("");

  const getTasks = async () => {
    const response = await api.get("/tasks");
    console.log("getTasks' response: ", response);
    setTodoList(response.data.data);
  };

  const addTask = async () => {
    try {
      const response = await api.post("/tasks", {
        task: todoValue,
        isComplete: false,
      });
      if (response.status === 200) {
        console.log("post 성공");
      } else {
        throw new Error("task can not be added!");
      }
      // console.log("addTask's response: ", response);
      // setTodoList([...todoList, response.data.data]);
      setTodoValue("");
      getTasks();
    } catch (err) {
      console.log("addTask error: ", err);
    }
  };

  const toggleComplete = async (id) => {
    try {
      const task = todoList.find((item) => item._id === id);
      const response = await api.put(`/tasks/${id}`, {
        isComplete: !task.isComplete,
      });
      if (response.status === 200) {
        getTasks();
      }
    } catch (err) {
      console.log("toggleComplete error: ", err);
    }
  };

  const deleteItem = async (id) => {
    try {
      console.log("deleteItem id: ", id);
      const response = await api.delete(`/tasks/${id}`);
      if (response.status === 200) {
        console.log("deleteItem 성공");
        getTasks();
      }
    } catch (err) {
      console.log("deleteItem error: ", err);
    }
  };

  // useEffect는 컴포넌트가 마운트 될 때, 언마운트 될 때 실행됨.
  useEffect(() => {
    getTasks();
  }, []);

  return (
    <Container>
      <Row className="add-item-row">
        <Col xs={12} sm={10}>
          <input
            type="text"
            placeholder="할일을 입력하세요"
            className="input-box"
            value={todoValue}
            onChange={(e) => setTodoValue(e.target.value)}
          />
        </Col>
        <Col xs={12} sm={2}>
          <button className="button-add" onClick={addTask}>
            추가
          </button>
        </Col>
      </Row>

      <TodoBoard
        todoList={todoList}
        toggleComplete={toggleComplete}
        deleteItem={deleteItem}
      />
    </Container>
  );
}

export default App;
