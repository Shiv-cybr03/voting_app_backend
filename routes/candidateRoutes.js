const express = require("express");
const router = express.Router();
const { User } = require("../model/user");
const { jwtAuthMiddleware, generateToken} = require("../jwt");
const { Candidate } = require("../model/candidate-model");


//
const checkAdminRole = async (userId) =>{
    try {
        const user = await User.findById(userId);
        return user.role === 'admin';

    } catch (error) {
        return false;
    }
}

//Post router to add a candidate 
router.post("/", jwtAuthMiddleware, async(req,res)=>{
    try {
        if(! await checkAdminRole(req.user.id))
            return res.status(403).json({message: "user has not have admin role"});
        
        const data = req.body;

        const newCandidate = new Candidate(data);
        //Save the newUser to the database.
        const response = await newCandidate.save();
        console.log("Data save sucessfully!");

        // Assuming you have a function to generate a token, use it here
        const token = generateToken({ 
            id: response.id 
        });

        res.status(200).json({ response: response, token: token });

    } catch (error) {
        console.log("Error:",error);
        res.status(500).json({error: "Internal server Error."})
    }
})


//To change the password.
router.put("/:candidateID", jwtAuthMiddleware, async(req,res)=>{
    try {
        if(!checkAdminRole(req.user.id))
            return res.status(403).json({message: "user has not have admin role"});
        //Extract the id from the url parameter.
        const candidateID = req.params.candidateID;

        //Update data from the candidate.
        const updateCandidateData = req.body;

        const response = await User.findByIdAndUpdate(candidateID, updateCandidateData, {
            new: true,  //Return the update document.
            runValidators: true,   //Run Mongooes Validation.
        })

        if(!response){
            return res.status(404).json({ error: "Candidate not found!"})
        }
    
        console.log("candidate data update !");
        res.status(200).json(response);
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Internal server Error"});
    }
});

router.delete("/:candidateID", jwtAuthMiddleware, async(req,res)=>{
    try {
        if(!checkAdminRole(req.user.id))
            return res.status(403).json({message: "user has not have admin role"});
        //Extract the id from the url parameter.
        const candidateID = req.params.candidateID;

        //Update data from the candidate.
        //const updateCandidateData = req.body;

        const response = await User.findByIdAndDelete(candidateID);

        if(!response){
            return res.status(404).json({ error: "Candidate not found!"})
        }
    
        console.log("candidate deleted !");
        res.status(200).json(response);
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Internal server Error"});
    }
});

//Let's start voting.
router.post("/vote/:candidateId", jwtAuthMiddleware, async (req, res) =>{
    //no admin can vote.
    //use can only vote once
    candidateID = req.params.candidateID;
    userId = req.user.id;

    try{
        //find the candidate documnet with the specificed candidateID
        const candidate = await Candidate.findById(candidateID);
        if(!Candidate){
            return res.status(404).json({message: "Candidate not found" })
        }
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({message: "user not found" })
        }
        if(user.isVoted){
            return res.status(400).json({message: "You have already voted" })
        }
        if(user.role == "admin"){
            return res.status(403).json({message: "admin is not allowed" })
        }

        // Update the candidate document to record the vote.
        candidate.vote.push({user: userId});
        candidate.voteCount++;
        await candidate.save();

        // update the user document 
        user.isVoted = true;
        await user.save();

        res.status(200).json({message: "VOte recorded successfully"})

    }catch(error){
        console.log(error);
        return res.status(404).json({error: "Internal server Error"});

    }
});

//Vote Count
router.get("/vote/count", async(req,res) =>{
    try {
        // Find all candidate and sort them by voteCount in descending order.
        const candidate = await Candidate.find().sort({voteCount: 'desc'});

        //Map the candidate to only return their name and voteCount
        const voteRecord = candidate.map((data)=>{
            return{
                party: data.party,
                count: data.voteCount
            }
        });

        return res.status(200).json(voteRecord);

    } catch (error) {
        console.log(error);
        return res.status(404).json({error: "Internal server Error"});
    }
});

router.delete('/:candidateID', jwtAuthMiddleware, async (req, res)=>{
    try{
        if(!checkAdminRole(req.user.id))
            return res.status(403).json({message: 'user does not have admin role'});
        
        const candidateID = req.params.candidateID; // Extract the id from the URL parameter

        const response = await Candidate.findByIdAndDelete(candidateID);

        if (!response) {
            return res.status(404).json({ error: 'Candidate not found' });
        }

        console.log('candidate deleted');
        res.status(200).json(response);
    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
})




module.exports = router;
