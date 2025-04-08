import { Member } from "../models/memberModel.js";
import bcrypt from "bcryptjs";
import { generateRegistrationEmail } from "../services/generateRegistrationEmail.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// @desc    Register new member
// @route   POST /api/members/register
// @access  Public
export const registerMember = async (req, res) => {
    try {
      const { name, email, password, phoneNumber, address } = req.body;
  
      // Check if member exists
      const memberExists = await Member.findOne({ email });
      if (memberExists) {
        return res.status(400).json({ message: "Member already exists" });
      }
  
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      // Generate verification token
      const verificationToken = crypto.randomBytes(32).toString('hex');
      
      // Create member
      const member = await Member.create({
        name,
        email,
        password: hashedPassword,
        phoneNumber,
        address,
        verificationToken, // You'll need to add this field to your schema
        // Other fields will use default values
      });
  
      if (member) {
        // Send verification email
        const emailContent = generateRegistrationEmail(name, verificationToken);
        
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: email,
          subject: emailContent.subject,
          text: emailContent.text,
          html: emailContent.html
        });
        
        res.status(201).json({
          _id: member._id,
          name: member.name,
          email: member.email,
          message: "Registration successful. Please check your email to verify your account."
        });
      } else {
        res.status(400).json({ message: "Invalid member data" });
      }
    } catch (error) {
      console.error("Register error:", error);
      res.status(500).json({ message: "Server error" });
    }
  };

// @desc    Login member
// @route   POST /api/members/login
// @access  Public
export const loginMember = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if member exists
    const member = await Member.findOne({ email });
    
    if (!member) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check if member is verified, not suspended, and not deleted
    if (!member.isVerified) {
      return res.status(401).json({ message: "Please verify your email before logging in" });
    }

    if (member.isSuspended) {
      return res.status(403).json({ message: "Your account has been suspended" });
    }

    if (member.isDeleted) {
      return res.status(403).json({ message: "This account no longer exists" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, member.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = jwt.sign(
      { id: member._id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(200).json({
      _id: member._id,
      name: member.name,
      email: member.email,
      profilePic: member.profilePic,
      token
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get member profile
// @route   GET /api/members/profile
// @access  Private
export const getProfile = async (req, res) => {
  try {
    const member = await Member.findById(req.member.id).select('-password');
    
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    res.status(200).json(member);
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update member profile
// @route   PUT /api/members/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const memberId = req.member.id;
    const { 
      name, 
      email, 
      bio, 
      phoneNumber, 
      address, 
      linkedinProfile, 
      githubProfile, 
      skills, 
      projects,
      profilePic
    } = req.body;

    // Find the member
    const member = await Member.findById(memberId);
    
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    // Update basic fields if provided
    if (name) member.name = name;
    if (email) member.email = email;
    if (bio) member.bio = bio;
    if (phoneNumber) member.phoneNumber = phoneNumber;
    if (address) member.address = address;
    if (linkedinProfile) member.linkedinProfile = linkedinProfile;
    if (githubProfile) member.githubProfile = githubProfile;
    if (profilePic) member.profilePic = profilePic;

    // Handle skills (maintain previous records and add new ones)
    if (skills && Array.isArray(skills) && skills.length > 0) {
      // Add only unique skills that aren't already in the array
      skills.forEach(skill => {
        if (!member.skills.includes(skill)) {
          member.skills.push(skill);
        }
      });
    }

    // Handle projects (maintain previous records and add new ones)
    if (projects && Array.isArray(projects) && projects.length > 0) {
      projects.forEach(project => {
        // Check if project with same id exists
        const existingProjectIndex = member.projects.findIndex(p => 
          p.id === project.id || p._id === project._id
        );
        
        if (existingProjectIndex !== -1) {
          // Update existing project
          member.projects[existingProjectIndex] = {
            ...member.projects[existingProjectIndex],
            ...project
          };
        } else {
          // Add new project
          member.projects.push(project);
        }
      });
    }

    // Save the updated member
    const updatedMember = await member.save();

    res.status(200).json({
      _id: updatedMember._id,
      name: updatedMember.name,
      email: updatedMember.email,
      bio: updatedMember.bio,
      profilePic: updatedMember.profilePic,
      phoneNumber: updatedMember.phoneNumber,
      address: updatedMember.address,
      skills: updatedMember.skills,
      projects: updatedMember.projects,
      linkedinProfile: updatedMember.linkedinProfile,
      githubProfile: updatedMember.githubProfile,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};