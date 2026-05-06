// // DEFAULT ADMIN (Hardcoded)
// const defaultAdmin = {
//     email: "admin@smartscholar.com",
//     password: "admin123",
//     role: "admin"
// };

// localStorage.setItem("admin", JSON.stringify(defaultAdmin));

// // LOGIN SYSTEM
// function login() {
//     const role = document.getElementById("loginRole").value;
//     const email = document.getElementById("loginEmail").value;
//     const password = document.getElementById("loginPassword").value;

//     const storedUser = JSON.parse(localStorage.getItem("user"));
//     const storedAdmin = JSON.parse(localStorage.getItem("admin"));

//     if (role === "admin") {
//         if (email === storedAdmin.email && password === storedAdmin.password) {
//             enterWebsite("admin");
//         } else {
//             alert("Invalid Admin credentials.");
//         }
//     } else {
//         if (!storedUser) {
//             alert("No account found. Please sign up first.");
//             return;
//         }

//         if (email === storedUser.email && password === storedUser.password) {
//             enterWebsite("user");
//         } else {
//             alert("Invalid email or password.");
//         }
//     }
// }

// function enterWebsite(role) {
//     document.getElementById("loginPage").style.display = "none";
//     document.getElementById("mainWebsite").classList.remove("hidden");

//     if (role === "admin") {
//         document.getElementById("adminSection").classList.remove("hidden");
//     } else {
//         document.getElementById("adminSection").classList.add("hidden");
//     }

//     localStorage.setItem("currentRole", role);
// }

// function logout() {
//     document.getElementById("loginPage").style.display = "flex";
//     document.getElementById("mainWebsite").classList.add("hidden");
// }

// // SIGNUP
// function signup() {
//     const name = document.getElementById("signupName").value;
//     const email = document.getElementById("signupEmail").value;
//     const password = document.getElementById("signupPassword").value;

//     if (!name || !email || !password) {
//         alert("Please fill all fields.");
//         return;
//     }

//     const user = { name, email, password, role: "user" };
//     localStorage.setItem("user", JSON.stringify(user));

//     alert("Signup successful! Please login.");
//     showLogin();
// }

// function showSignup() {
//     document.getElementById("loginCard").classList.add("hidden");
//     document.getElementById("signupCard").classList.remove("hidden");
// }

// function showLogin() {
//     document.getElementById("signupCard").classList.add("hidden");
//     document.getElementById("loginCard").classList.remove("hidden");
// }

// // ================= ADMIN FEATURES =================

// function getScholarships() {
//     return JSON.parse(localStorage.getItem("scholarships")) || [];
// }

// function saveScholarships(list) {
//     localStorage.setItem("scholarships", JSON.stringify(list));
//     displayScholarships();
// }

// function displayScholarships() {
//     const list = getScholarships();
//     const container = document.getElementById("adminScholarshipList");
//     container.innerHTML = "";

//     list.forEach((item, index) => {
//         container.innerHTML += `
//             <div class="scholarship-item">
//                 ${index + 1}. <strong>${item.name}</strong> - ${item.prob}%
//             </div>
//         `;
//     });
// }

// function addScholarship() {
//     if (localStorage.getItem("currentRole") !== "admin") {
//         alert("Access Denied!");
//         return;
//     }

//     const name = document.getElementById("modalScholarshipName").value;
//     const prob = document.getElementById("modalScholarshipProb").value;

//     if (!name || !prob) {
//         alert("Fill all fields");
//         return;
//     }

//     const list = getScholarships();
//     list.push({ name, prob });
//     saveScholarships(list);

//     closeModal();

//     document.getElementById("modalScholarshipName").value = "";
//     document.getElementById("modalScholarshipProb").value = "";
// }

// function editScholarship() {
//     const name = document.getElementById("scholarshipName").value;
//     const prob = document.getElementById("scholarshipProb").value;

//     const list = getScholarships();
//     const item = list.find(s => s.name === name);

//     if (item) {
//         item.prob = prob;
//         saveScholarships(list);
//     } else {
//         alert("Scholarship not found");
//     }
// }

// function deleteScholarship() {
//     const name = document.getElementById("scholarshipName").value;

//     let list = getScholarships();
//     list = list.filter(s => s.name !== name);
//     saveScholarships(list);
// }

// function displayScholarships() {
//     const list = JSON.parse(localStorage.getItem("scholarships")) || [];
//     const container = document.getElementById("adminScholarshipList");

//     container.innerHTML = "";

//     list.forEach((item, index) => {
//         container.innerHTML += `
//             <div class="scholarship-item">
//                 ${index + 1}. <strong>${item.name}</strong> - ${item.prob}%
//             </div>
//         `;
//     });
// }

// displayScholarships();

// // SCROLL
// function scrollToForm() {
//     showSection("formSection");
//     document.getElementById("formSection").scrollIntoView({ behavior: "smooth" });
// }

// // FORM SUBMIT
// document.getElementById("predictionForm").addEventListener("submit", async function(e) {
//     e.preventDefault();

//     const loader = document.getElementById("loader");
//     loader.classList.remove("hidden");

//     const data = {
//         "Education Qualification": document.getElementById("EducationQualification").value,
//         "Gender": document.getElementById("Gender").value,
//         "Community": document.getElementById("Community").value,
//         "Religion": document.getElementById("Religion").value,
//         "Exservice-men": document.getElementById("Exservicemen").value,
//         "Disability": document.getElementById("Disability").value,
//         "Sports": document.getElementById("Sports").value,
//         "Annual-Percentage": document.getElementById("AnnualPercentage").value,
//         "Income": document.getElementById("Income").value
//     };

//     try {
//         const response = await fetch("http://127.0.0.1:5000/predict", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify(data)
//         });

//         const result = await response.json();
//         loader.classList.add("hidden");

//         if (result.status === "success") {
//             const resultsDiv = document.getElementById("results");
//             resultsDiv.innerHTML = "";

//             result.recommendations.forEach(item => {
//                 resultsDiv.innerHTML += `
//                     <div class="scholarship-item">
//                         <strong>${item.scholarship_name}</strong><br>
//                         Eligibility Probability: ${item.eligibility_probability}%
//                     </div>
//                 `;
//             });

//             document.getElementById("resultCard").classList.remove("hidden");

//         } else {
//             alert("Server Error: " + result.error);
//         }

//     } catch (error) {
//         loader.classList.add("hidden");
//         alert("Error connecting to backend server.");
//         console.error(error);
//     }
// });

// // AOS
// AOS.init({
//     duration: 800,
//     once: true
// });

// // NAVBAR SHRINK
// window.addEventListener("scroll", function() {
//     const navbar = document.getElementById("navbar");
//     if (navbar && window.scrollY > 50) {
//         navbar.classList.add("scrolled");
//     } else if (navbar) {
//         navbar.classList.remove("scrolled");
//     }
// });
// function toggleMenu() {
//     document.getElementById("navMenu").classList.toggle("active");
// }
// // ================= MODAL CONTROL =================

// function openModal() {
//     if (localStorage.getItem("currentRole") !== "admin") {
//         alert("Access Denied!");
//         return;
//     }

//     document.getElementById("scholarshipModal").classList.remove("hidden");
// }

// function closeModal() {
//     document.getElementById("scholarshipModal").classList.add("hidden");
// }



// // ================= SAFE DOM LOADER =================
// document.addEventListener("DOMContentLoaded", function () {

//     const addBtn = document.getElementById("addBtn");
//     const modal = document.getElementById("scholarshipModal");
//     const closeBtn = document.getElementById("closeModalBtn");
//     const saveBtn = document.getElementById("saveScholarship");

//     if (addBtn) {
//         addBtn.addEventListener("click", function () {

//             const role = localStorage.getItem("currentRole");

//             if (role !== "admin") {
//                 alert("Access Denied!");
//                 return;
//             }

//             modal.classList.remove("hidden");
//         });
//     }

//     if (closeBtn) {
//         closeBtn.addEventListener("click", function () {
//             modal.classList.add("hidden");
//         });
//     }

//     if (saveBtn) {
//         saveBtn.addEventListener("click", function () {

//             const name = document.getElementById("modalScholarshipName").value;
//             const prob = document.getElementById("modalScholarshipProb").value;

//             if (!name || !prob) {
//                 alert("Please fill all fields");
//                 return;
//             }

//             const list = JSON.parse(localStorage.getItem("scholarships")) || [];
//             list.push({ name, prob });
//             localStorage.setItem("scholarships", JSON.stringify(list));

//             displayScholarships();

//             modal.classList.add("hidden");

//             document.getElementById("modalScholarshipName").value = "";
//             document.getElementById("modalScholarshipProb").value = "";
//         });
//     }

// });

// ================= DEFAULT ADMIN =================
const defaultAdmin = {
    email: "admin@smartscholar.com",
    password: "admin123",
    role: "admin"
};

localStorage.setItem("admin", JSON.stringify(defaultAdmin));

// ================= LOGIN =================
function login() {
    const role = document.getElementById("loginRole").value;
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    const storedUser = JSON.parse(localStorage.getItem("user"));
    const storedAdmin = JSON.parse(localStorage.getItem("admin"));

    if (role === "admin") {
        if (email === storedAdmin.email && password === storedAdmin.password) {
            enterWebsite("admin", "Admin");
        } else {
            alert("Invalid Admin credentials.");
        }
    } else {
        if (!storedUser) {
            alert("No account found. Please sign up first.");
            return;
        }

        if (email === storedUser.email && password === storedUser.password) {
            enterWebsite("user", storedUser.name);
        } else {
            alert("Invalid email or password.");
        }
    }
}

function enterWebsite(role) {
    document.getElementById("loginPage").style.display = "none";
    document.getElementById("mainWebsite").classList.remove("hidden");

    const navAdmin = document.getElementById("navAdmin");
    const adminSection = document.getElementById("adminSection");
    const homeSection = document.getElementById("homeSection");
    const formSection = document.getElementById("formSection");
    const navEligibility = document.getElementById("navEligibility");
    const navHome = document.getElementById("navHome");

    if (role === "admin") {
        // Admin View Restriction
        navAdmin.classList.remove("hidden");
        adminSection.classList.remove("hidden");
        
        homeSection.classList.add("hidden");
        formSection.classList.add("hidden");
        navEligibility.classList.add("hidden");
        navHome.classList.add("hidden");

        loadAdminDashboard();
        displayScholarships();
    } else {
        // User View Restriction
        navAdmin.classList.add("hidden");
        adminSection.classList.add("hidden");
        
        homeSection.classList.remove("hidden");
        formSection.classList.remove("hidden");
        navEligibility.classList.remove("hidden");
        navHome.classList.remove("hidden");
    }

    localStorage.setItem("currentRole", role);
}

function logout() {
    localStorage.removeItem("currentRole");
    document.getElementById("loginPage").style.display = "flex";
    document.getElementById("mainWebsite").classList.add("hidden");
}

window.onload = () => {
    const role = localStorage.getItem("currentRole");
    const storedUser = JSON.parse(localStorage.getItem("user"));
    
    if (role) {
        const userName = role === "admin" ? "Admin" : (storedUser ? storedUser.name : "Scholar");
        enterWebsite(role, userName);
    }
};

async function loadAdminDashboard() {
    try {
        const response = await fetch("http://127.0.0.1:5000/admin/stats", {
            headers: { "Authorization": localStorage.getItem("currentRole") }
        });
        const data = await response.json();
        if (data.status === "success") {
            document.getElementById("totalScholarshipsStat").innerText = data.total_scholarships;
            document.getElementById("totalProvidersStat").innerText = data.total_providers;
        }
    } catch(err) {
        console.error("Error loading mock stats:", err);
    }
}

async function retrainModel() {
    const btn = document.getElementById("retrainBtn");
    btn.innerText = "Retraining... Please Wait";
    btn.disabled = true;

    try {
        const response = await fetch("http://127.0.0.1:5000/admin/retrain", {
            method: "POST",
            headers: { 
                "Authorization": localStorage.getItem("currentRole"),
                "Content-Type": "application/json" 
            }
        });
        const data = await response.json();
        if (data.status === "success") {
            alert("AI Model Retrained and Reloaded Successfully!");
        } else {
            alert("Access Denied or Server Error: " + data.error);
        }
    } catch (err) {
        alert("Failed to reach server.");
    }

    btn.innerText = "Retrain ML Model";
    btn.disabled = false;
}

// ================= SIGNUP =================
function signup() {
    const name = document.getElementById("signupName").value;
    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;

    if (!name || !email || !password) {
        alert("Please fill all fields.");
        return;
    }

    const user = { name, email, password };
    localStorage.setItem("user", JSON.stringify(user));

    alert("Signup successful! Please login.");
    showLogin();
}

function showSignup() {
    document.getElementById("loginCard").classList.add("hidden");
    document.getElementById("signupCard").classList.remove("hidden");
}

function showLogin() {
    document.getElementById("signupCard").classList.add("hidden");
    document.getElementById("loginCard").classList.remove("hidden");
}

// ================= SCROLL =================
function scrollToForm() {
    const formSection = document.getElementById("formSection");
    if(formSection) {
        formSection.scrollIntoView({ behavior: "smooth" });
    }
}

// ================= ADMIN SYSTEM =================

function isAdmin() {
    return localStorage.getItem("currentRole") === "admin";
}

function getScholarships() {
    return JSON.parse(localStorage.getItem("scholarships")) || [];
}

function saveScholarships(list) {
    localStorage.setItem("scholarships", JSON.stringify(list));
    displayScholarships();
}

function displayScholarships() {
    const list = getScholarships();
    const container = document.getElementById("adminScholarshipList");

    container.innerHTML = "";

    list.forEach((item, index) => {
        container.innerHTML += `
            <div class="scholarship-item">
                ${index + 1}. <strong>${item.name}</strong> - ${item.prob}%
                <br><br>
                <button onclick="editScholarship(${index})" class="primary-btn">Edit</button>
                <button onclick="deleteScholarship(${index})" class="danger-btn">Delete</button>
            </div>
        `;
    });
}

// ================= ADD =================
function addScholarship() {
    if (!isAdmin()) {
        alert("Access Denied!");
        return;
    }

    const name = prompt("Enter Scholarship Name:");
    if (!name) return;

    const prob = prompt("Enter Eligibility Percentage:");
    if (!prob) return;

    const list = getScholarships();
    list.push({ name, prob });

    saveScholarships(list);

    alert("Scholarship Added Successfully!");
}

// ================= EDIT =================
function editScholarship(index) {
    if (!isAdmin()) {
        alert("Access Denied!");
        return;
    }

    const list = getScholarships();

    const newName = prompt("Edit Scholarship Name:", list[index].name);
    if (!newName) return;

    const newProb = prompt("Edit Eligibility Percentage:", list[index].prob);
    if (!newProb) return;

    list[index].name = newName;
    list[index].prob = newProb;

    saveScholarships(list);

    alert("Scholarship Updated Successfully!");
}

// ================= DELETE =================
function deleteScholarship(index) {
    if (!isAdmin()) {
        alert("Access Denied!");
        return;
    }

    const list = getScholarships();

    if (confirm("Are you sure you want to delete this scholarship?")) {
        list.splice(index, 1);
        saveScholarships(list);
        alert("Scholarship Deleted Successfully!");
    }
}

let predictionChartInstance = null;

// ================= FORM SUBMIT =================
document.getElementById("predictionForm").addEventListener("submit", async function(e) {
    e.preventDefault();

    const loader = document.getElementById("loader");
    loader.classList.remove("hidden");

    const data = {
        "Education Qualification": document.getElementById("EducationQualification").value,
        "Gender": document.getElementById("Gender").value,
        "Community": document.getElementById("Community").value,
        "Disability": document.getElementById("Disability").value,
        "Sports": document.getElementById("Sports").value,
        "Annual-Percentage": document.getElementById("AnnualPercentage").value,
        "Income": document.getElementById("Income").value
    };

    try {
        const response = await fetch("http://127.0.0.1:5000/predict", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        loader.classList.add("hidden");

        if (result.status === "success") {
            const resultsDiv = document.getElementById("results");
            resultsDiv.innerHTML = "";
            resultsDiv.classList.add("results-grid"); 

            const chartLabels = [];
            const chartData = [];

            result.recommendations.forEach(item => {
                chartLabels.push(item.scholarship_name.substring(0, 15) + "...");
                chartData.push(item.eligibility_probability);

                let reasonsHtml = "";
                if(item.reasons && item.reasons.length > 0) {
                    item.reasons.forEach(r => {
                        reasonsHtml += `<span style="display:inline-block; background:#e0f7fa; color:#00796b; padding:4px 8px; border-radius:12px; font-size:12px; margin:2px;">✨ ${r}</span>`;
                    });
                }

                resultsDiv.innerHTML += `
                    <div class="scholarship-card">
                        <h3>${item.scholarship_name}</h3>
                        <div class="card-details">
                            <p><strong>Amount:</strong> ${item.amount}</p>
                            <p><strong>Eligibility:</strong> ${item.eligibility_probability}% Match</p>
                            <p><strong>Deadline:</strong> ${item.deadline}</p>
                            <div style="margin-top:8px; margin-bottom:12px;">
                                ${reasonsHtml}
                            </div>
                        </div>
                        <a href="${item.apply_link}" target="_blank" class="primary-btn apply-btn">Apply Now</a>
                        <button onclick="alert('Reminder scheduled for 3 days before: ${item.deadline}')" class="secondary-btn" style="width: 100%; margin-top: 5px; background: #f3f4f6; color: #333; padding: 10px; border: 1px solid #ccc; border-radius: 5px; cursor: pointer; font-weight: 500;">🔔 Remind Me</button>
                    </div>
                `;
            });

            document.getElementById("resultCard").classList.remove("hidden");

            const ctx = document.getElementById("predictionChart").getContext("2d");
            if (predictionChartInstance) {
                predictionChartInstance.destroy();
            }
            
            predictionChartInstance = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: chartLabels,
                    datasets: [{
                        label: 'AI Match Probability (%)',
                        data: chartData,
                        backgroundColor: [
                            'rgba(37, 99, 235, 0.6)',
                            'rgba(16, 185, 129, 0.6)',
                            'rgba(139, 92, 246, 0.6)'
                        ],
                        borderColor: [
                            'rgba(37, 99, 235, 1)',
                            'rgba(16, 185, 129, 1)',
                            'rgba(139, 92, 246, 1)'
                        ],
                        borderWidth: 1,
                        borderRadius: 5
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 100
                        }
                    }
                }
            });

        } else {
            alert("Server Error: " + result.error);
        }

    } catch (error) {
        loader.classList.add("hidden");
        alert("Error connecting to backend server.");
        console.error(error);
    }
});

// ================= AOS =================
AOS.init({
    duration: 800,
    once: true
});

// ================= NAVBAR =================
window.addEventListener("scroll", function() {
    const navbar = document.getElementById("navbar");
    if (navbar && window.scrollY > 50) {
        navbar.classList.add("scrolled");
    } else if (navbar) {
        navbar.classList.remove("scrolled");
    }
});

function toggleMenu() {
    document.getElementById("navMenu").classList.toggle("active");
}

// ================= DOM LOADED =================
document.addEventListener("DOMContentLoaded", function () {

    // Allow pressing "Enter" to login/signup
    const loginPage = document.getElementById("loginPage");
    if (loginPage) {
        loginPage.addEventListener("keypress", function (e) {
            if (e.key === "Enter") {
                if (!document.getElementById("loginCard").classList.contains("hidden")) {
                    login();
                } else if (!document.getElementById("signupCard").classList.contains("hidden")) {
                    signup();
                }
            }
        });
    }

    const saveBtn = document.getElementById("saveScholarship");
    const closeBtn = document.getElementById("closeModalBtn");

    if (saveBtn) {
        saveBtn.addEventListener("click", addScholarship);
    }

    if (closeBtn) {
        closeBtn.addEventListener("click", closeModal);
    }
});