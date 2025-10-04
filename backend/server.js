const express =require("express")
const fs =require=("fs")
const cors =require=("cors")
const bodyParser=require("body-parser")

const app =express()
app.use(cors())
app.use(bodyParser.json())

const DATA_FILE="./backend/students.json"

//Helper function to read students
function getStudents(){
    const data =fs.readFileSync(DATA_FILE,"utf8")
    return JSON.parse(data || "[]")
}

//Helper function to save students
function saveStudents(students){
    fs.writeFileSync(DATA_FILE, JSON.stringify(students, null, 2));

}

//Get all students
app.get("/students",(req,res)=>{
    res.json(getStudents())
})
 
//post new student
app.post("/students",(req,res)=>{
    const students=getStudents()
    students.push(req.body)
    saveStudents(students)
    res.status(201).json({message:"Student added successfully"})
})
// PUT: Update student details by admission number
app.put("/students/:admno", (req, res) => {
  const admno = req.params.admno;
  const { name, score } = req.body;

  // find the student by admno
  const studentIndex = students.findIndex((s) => s.admno === admno);

  if (studentIndex === -1) {
    return res.status(404).json({ message: "Student not found" });
  }

  // validate name and score before updating
  if (!name || typeof name !== "string" || !/^[A-Za-z\s]+$/.test(name)) {
    return res.status(400).json({ message: "Invalid name format" });
  }
  if (isNaN(score) || score < 0 || score > 100) {
    return res.status(400).json({ message: "Score must be between 0 and 100" });
  }

  // update the student details
  students[studentIndex] = { admno, name, score };

  res.json({
    message: `Student ${admno} updated successfully`,
    updated: students[studentIndex],
  });
});


//Delete a student by name
app.delete("/students/:name",(req,res)=>{
    let students=getStudents()
    students=students.filter(s=>s.name !== req.params.name)
    saveStudents(students)
    res.json({message:"Student deleted"})
})
//start server
const PORT=5000
app.listen(PORT,()=>console.log(`Server running on port ${PORT}`))