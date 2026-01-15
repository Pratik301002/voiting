function vote() {
    if (localStorage.getItem("voted")) {
      showThankYou();
      return;
    }
  
    const name = document.getElementById("name").value.trim();
    const candidate = document.getElementById("candidate").value;
  
    if (!name || !candidate) {
      alert("Please enter your name and select an option.");
      return;
    }
  
    fetch("/vote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, candidate })
    })
    .then(res => res.json())
    .then(() => {
      localStorage.setItem("voted", "true");
      showThankYou();
    });
  }
  
  function showThankYou() {
    document.getElementById("voteContainer").style.display = "none";
    document.getElementById("thankYouContainer").style.display = "block";
  }
  
  // Auto-show thank you screen if already voted
  if (localStorage.getItem("voted")) {
    showThankYou();
  }
  
  
  function login() {
    const adminId = document.getElementById("adminId").value;
    const password = document.getElementById("password").value;
  
    fetch("/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adminId, password })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        document.getElementById("adminArea").style.display = "block";
        loadVotes();
      } else {
        alert("Invalid credentials");
      }
    });
  }
  
  function loadVotes() {
    fetch("/admin/votes")
      .then(res => res.json())
      .then(votes => {
        const table = document.getElementById("votesTable");
        votes.forEach(v => {
          const row = table.insertRow();
          row.insertCell(0).innerText = v.name;
          row.insertCell(1).innerText = v.candidate;
          row.insertCell(2).innerText = new Date(v.time).toLocaleString();
        });
      });
  }

  function loadVotes() {
    fetch("/admin/votes")
      .then(res => res.json())
      .then(votes => {
        const table = document.getElementById("votesTable");
  
        let yes = 0;
        let no = 0;
  
        votes.forEach(v => {
          if (v.candidate === "Yes") yes++;
          if (v.candidate === "No") no++;
  
          const row = table.insertRow();
          row.insertCell(0).innerText = v.name;
          row.insertCell(1).innerText = v.candidate;
          row.insertCell(2).innerText = new Date(v.time).toLocaleString();
        });
  
        document.getElementById("yesCount").innerText = yes;
        document.getElementById("noCount").innerText = no;
      });
  }
  