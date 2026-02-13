import axios from 'axios';

function App() {
  const registerTestUser = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/register', {
        fullName: "Islam Dev",
        email: `dev${Math.floor(Math.random() * 1000)}@test.com`,
        tcNo: "12345678901"
      });
      alert(res.data.message);
    } catch (err) {
      alert("Registration failed!");
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>OmniRent Admin Panel</h1>
      <button onClick={registerTestUser} style={{ padding: '10px 20px', cursor: 'pointer' }}>
        Register Test User
      </button>
    </div>
  );
}

export default App;