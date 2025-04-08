import { Member } from "../models/memberModel.js";
import dotenv from "dotenv";

dotenv.config();

// @desc    Get all deleted members
// @route   GET /api/admin/members/deleted
// @access  Admin
export const getDeletedMembers = async (req, res) => {
  try {
    const deletedMembers = await Member.find({ isDeleted: true }).select('-password');
    
    res.status(200).json(deletedMembers);
  } catch (error) {
    console.error("Get deleted members error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get all suspended members
// @route   GET /api/admin/members/suspended
// @access  Admin
export const getSuspendedMembers = async (req, res) => {
  try {
    const suspendedMembers = await Member.find({ isSuspended: true, isDeleted: false }).select('-password');
    
    res.status(200).json(suspendedMembers);
  } catch (error) {
    console.error("Get suspended members error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get all non-verified members
// @route   GET /api/admin/members/non-verified
// @access  Admin
export const getNonVerifiedMembers = async (req, res) => {
  try {
    const nonVerifiedMembers = await Member.find({ 
      isVerified: false, 
      isDeleted: false 
    }).select('-password');
    
    res.status(200).json(nonVerifiedMembers);
  } catch (error) {
    console.error("Get non-verified members error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Delete a member (soft delete)
// @route   PUT /api/admin/members/:id/delete
// @access  Admin
export const deleteMember = async (req, res) => {
  try {
    const memberId = req.params.id;
    
    const member = await Member.findById(memberId);
    
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }
    
    member.isDeleted = true;
    await member.save();
    
    res.status(200).json({ 
      message: "Member has been deleted successfully",
      memberId: member._id
    });
  } catch (error) {
    console.error("Delete member error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Restore a deleted member
// @route   PUT /api/admin/members/:id/restore
// @access  Admin
export const restoreMember = async (req, res) => {
  try {
    const memberId = req.params.id;
    
    const member = await Member.findById(memberId);
    
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }
    
    member.isDeleted = false;
    await member.save();
    
    res.status(200).json({ 
      message: "Member has been restored successfully",
      memberId: member._id
    });
  } catch (error) {
    console.error("Restore member error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Suspend a member
// @route   PUT /api/admin/members/:id/suspend
// @access  Admin
export const suspendMember = async (req, res) => {
  try {
    const memberId = req.params.id;
    
    const member = await Member.findById(memberId);
    
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }
    
    member.isSuspended = true;
    await member.save();
    
    res.status(200).json({ 
      message: "Member has been suspended successfully",
      memberId: member._id
    });
  } catch (error) {
    console.error("Suspend member error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Unsuspend a member
// @route   PUT /api/admin/members/:id/unsuspend
// @access  Admin
export const unsuspendMember = async (req, res) => {
  try {
    const memberId = req.params.id;
    
    const member = await Member.findById(memberId);
    
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }
    
    member.isSuspended = false;
    await member.save();
    
    res.status(200).json({ 
      message: "Member has been unsuspended successfully",
      memberId: member._id
    });
  } catch (error) {
    console.error("Unsuspend member error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Verify a member
// @route   PUT /api/admin/members/:id/verify
// @access  Admin
export const verifyMember = async (req, res) => {
  try {
    const memberId = req.params.id;
    
    const member = await Member.findById(memberId);
    
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }
    
    member.isVerified = true;
    member.verificationToken = undefined; // Clear any existing verification token
    await member.save();
    
    res.status(200).json({ 
      message: "Member has been verified successfully",
      memberId: member._id
    });
  } catch (error) {
    console.error("Verify member error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get all members (with optional filters)
// @route   GET /api/admin/members
// @access  Admin
export const getAllMembers = async (req, res) => {
  try {
    // Add query parameters for filtering
    const { verified, suspended, deleted } = req.query;
    
    const filter = {};
    
    // Apply filters if provided
    if (verified !== undefined) {
      filter.isVerified = verified === 'true';
    }
    
    if (suspended !== undefined) {
      filter.isSuspended = suspended === 'true';
    }
    
    if (deleted !== undefined) {
      filter.isDeleted = deleted === 'true';
    }
    
    const members = await Member.find(filter).select('-password');
    
    res.status(200).json(members);
  } catch (error) {
    console.error("Get all members error:", error);
    res.status(500).json({ message: "Server error" });
  }
};