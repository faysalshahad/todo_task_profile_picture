import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  ListGroup,
  Dropdown,
  Modal,
  Card,
  Image,
} from "react-bootstrap";
import { FaEdit, FaTrash, FaCheckCircle } from "react-icons/fa";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [username, setUsername] = useState("User");
  const [showNameModal, setShowNameModal] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [file, setFile] = useState();
  const [profilePicture, setProfilePicture] = useState(
    "https://e7.pngegg.com/pngimages/154/803/png-clipart-computer-icons-user-profile-avatar-blue-heroes.png"
  );
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchTasks = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/tasks", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const allTasks = res.data;
        setTasks(allTasks.filter((task) => task.status !== "completed"));
        setCompletedTasks(
          allTasks.filter((task) => task.status === "completed")
        );
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, [token]);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsername(res.data.name || "User");
        setProfilePicture(res.data.profilePic || profilePicture);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/tasks",
        { title, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks([...tasks, res.data]);
      setTitle("");
      setDescription("");
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const handleCompleteTask = async (taskId) => {
    try {
      const res = await axios.patch(
        `http://localhost:5000/api/tasks/${taskId}/complete`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks(tasks.filter((task) => task.id !== taskId));
      setCompletedTasks([...completedTasks, res.data.task]);
    } catch (error) {
      console.error("Error marking task as completed:", error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(tasks.filter((task) => task.id !== taskId));
      setCompletedTasks(completedTasks.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleShowEditModal = (task) => {
    setCurrentTask(task);
    setShowModal(true);
  };

  const handleUpdateTask = async () => {
    if (!currentTask) return;

    try {
      const res = await axios.put(
        `http://localhost:5000/api/tasks/${currentTask.id}`,
        { title: currentTask.title, description: currentTask.description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Update tasks and completedTasks state based on task status
      if (currentTask.status === "completed") {
        setCompletedTasks(
          completedTasks.map((task) =>
            task.id === currentTask.id ? res.data : task
          )
        );
      } else {
        setTasks(
          tasks.map((task) => (task.id === currentTask.id ? res.data : task))
        );
      }

      setShowModal(false);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleUpdateName = async () => {
    try {
      const res = await axios.put(
        "http://localhost:5000/api/user/update-name", // Fix API route
        { name: newUsername },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsername(res.data.name); // Update UI instantly
      alert("Name updated successfully!");
      setShowNameModal(false);
    } catch (error) {
      console.error("Error updating name:", error);
    }
  };

  const handleFile = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUploadPicture = async () => {
    if (!file) {
      alert("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("profilePic", file);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/user/upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Cache busting: Adding a timestamp as a query parameter
      const timestamp = new Date().getTime();
      const newProfilePicUrl = `http://localhost:5000${res.data.profilePic}?t=${timestamp}`;

      setProfilePicture(newProfilePicUrl); // Update profile picture with cache busting

      // setProfilePicture(res.data.profilePic); // Update profile picture
      //setProfilePicture(`http://localhost:5000${res.data.profilePic}`); // Full URL
      alert("Profile picture updated!");
    } catch (error) {
      console.error("Error uploading picture:", error);
    }
  };

  return (
    <Container className="mt-4">
      <Row className="mb-3">
        <Col>
          <h2>To Do List Dashboard</h2>
        </Col>
        <Col className="text-end">
          <Button variant="danger" onClick={handleLogout}>
            Logout
          </Button>
        </Col>
      </Row>

      {/* Profile Section */}
      <Row className="mb-3 d-flex align-items-center">
        <Col md={3} className="text-center">
          <Image src={profilePicture} roundedCircle width={150} height={150} />
          <Form.Control type="file" onChange={handleFile} className="mt-2" />

          <Button className="mt-2" onClick={handleUploadPicture}>
            Upload Picture
          </Button>
        </Col>

        <Col md={5} className="d-flex align-items-center">
          <h5 className="me-2">Hello,</h5>
          <h4 className="fw-bold">{username}</h4>
          <Button
            variant="link"
            className="ms-2"
            onClick={() => {
              setNewUsername(username); // Set existing name when modal opens
              setShowNameModal(true);
            }}
          >
            <FaEdit />
          </Button>
        </Col>
      </Row>

      {/* Edit Name Modal */}
      <Modal show={showNameModal} onHide={() => setShowNameModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Name</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>New Name</Form.Label>
              <Form.Control
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder="Enter your new name"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowNameModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdateName}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      <br></br>

      {/* Task Creation */}
      <Row className="mb-4">
        <Col md={8}>
          <h4>New Task</h4>
          <Form onSubmit={handleCreateTask}>
            <Row>
              <Col>
                <Form.Control
                  type="text"
                  placeholder="Task Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </Col>
              <Col>
                <Form.Control
                  type="text"
                  placeholder="Task Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </Col>
              <Col>
                <Button variant="primary" type="submit">
                  Create Task
                </Button>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>

      {/* Task Filter Dropdown */}
      <Row className="mb-3">
        <Col md={4}>
          <Dropdown>
            <Dropdown.Toggle variant="secondary">Filter Tasks</Dropdown.Toggle>
            <Dropdown.Menu>
              {/* <Dropdown.Item onClick={() => setFilter("all")}>
                All Tasks
              </Dropdown.Item> */}
              <Dropdown.Item onClick={() => setFilter("pending")}>
                Pending Tasks
              </Dropdown.Item>
              <Dropdown.Item onClick={() => setFilter("completed")}>
                Completed Tasks
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </Row>

      {/* Task List */}
      <Row>
        <Col>
          <h4>{filter === "completed" ? "Completed Tasks" : "My Due Tasks"}</h4>
          <ListGroup>
            {(filter === "completed" ? completedTasks : tasks).map((task) => (
              <ListGroup.Item
                key={task.id}
                className="d-flex justify-content-between align-items-center"
              >
                <div>
                  <strong>{task.title}</strong> - {task.description}
                </div>
                <div>
                  {task.status !== "completed" && (
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => handleCompleteTask(task.id)}
                    >
                      <FaCheckCircle /> Complete
                    </Button>
                  )}
                  <Button
                    variant="warning"
                    size="sm"
                    className="ms-2"
                    onClick={() => handleShowEditModal(task)}
                  >
                    <FaEdit /> Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    className="ms-2"
                    onClick={() => handleDeleteTask(task.id)}
                  >
                    <FaTrash /> Delete
                  </Button>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
      </Row>

      {/* Edit Task Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Task Title</Form.Label>
              <Form.Control
                type="text"
                value={currentTask?.title || ""}
                onChange={(e) =>
                  setCurrentTask({ ...currentTask, title: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mt-2">
              <Form.Label>Task Description</Form.Label>
              <Form.Control
                type="text"
                value={currentTask?.description || ""}
                onChange={(e) =>
                  setCurrentTask({
                    ...currentTask,
                    description: e.target.value,
                  })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdateTask}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Dashboard;
