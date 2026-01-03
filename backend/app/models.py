from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, DateTime, Text, Float, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from .database import Base

class UserRole(str, enum.Enum):
    CITIZEN = "Citizen"
    FIELD_OFFICER = "FieldOfficer"
    ADMIN = "Admin"
    ZONAL_OFFICER = "ZonalOfficer"
    POLICY_MAKER = "PolicyMaker"
    AUDITOR = "Auditor"

class GrievanceStatus(str, enum.Enum):
    NEW = "New"
    ASSIGNED = "Assigned"
    IN_PROGRESS = "In Progress"
    PENDING_VERIFICATION = "Pending Verification"
    RESOLVED = "Resolved"
    CLOSED = "Closed"
    ESCALATED = "Escalated"
    REJECTED = "Rejected"
    SPAM = "Spam"

class Priority(str, enum.Enum):
    LOW = "Low"
    MEDIUM = "Medium"
    HIGH = "High"
    CRITICAL = "Critical"

class Region(Base):
    __tablename__ = "regions"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    code = Column(String, unique=True, index=True)
    type = Column(String)  # State, District, Ward
    parent_id = Column(Integer, ForeignKey("regions.id"), nullable=True)
    lat = Column(Float, nullable=True)
    lng = Column(Float, nullable=True)

    users = relationship("User", back_populates="region")
    grievances = relationship("Grievance", back_populates="region")
    parent = relationship("Region", remote_side=[id], backref="children")

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    full_name = Column(String)
    role = Column(String, default=UserRole.CITIZEN)
    is_active = Column(Boolean, default=True)
    phone_number = Column(String, nullable=True)
    
    # New fields for field officers
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=True)
    region_id = Column(Integer, ForeignKey("regions.id"), nullable=True) # Changed from region_code
    region_code = Column(String, nullable=True) # Kept for backward compatibility
    state = Column(String, nullable=True)
    district = Column(String, nullable=True)

    grievances = relationship("Grievance", back_populates="citizen", foreign_keys="[Grievance.citizen_id]")
    assigned_grievances = relationship("Grievance", back_populates="assignee", foreign_keys="[Grievance.assignee_id]")
    department = relationship("Department", back_populates="officers")
    region = relationship("Region", back_populates="users")

class Department(Base):
    __tablename__ = "departments"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    code = Column(String, unique=True)
    
    grievances = relationship("Grievance", back_populates="department")
    officers = relationship("User", back_populates="department")

class Grievance(Base):
    __tablename__ = "grievances"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(Text)
    citizen_id = Column(Integer, ForeignKey("users.id"))
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=True)
    assignee_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    region_id = Column(Integer, ForeignKey("regions.id"), nullable=True)
    
    status = Column(String, default=GrievanceStatus.NEW)
    priority = Column(String, default=Priority.LOW)
    category = Column(String, nullable=True)
    
    # AI Fields
    category_ai = Column(String, nullable=True)
    severity_ai = Column(Float, nullable=True)
    is_spam = Column(Boolean, default=False)
    privacy_consent = Column(Boolean, default=False)

    location = Column(String, nullable=True)
    region_code = Column(String, nullable=True) 
    state = Column(String, nullable=True)
    district = Column(String, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    sentiment_score = Column(Float, nullable=True)
    ai_summary = Column(Text, nullable=True)
    embedding = Column(Text, nullable=True)

    citizen = relationship("User", back_populates="grievances", foreign_keys=[citizen_id])
    assignee = relationship("User", back_populates="assigned_grievances", foreign_keys=[assignee_id])
    department = relationship("Department", back_populates="grievances")
    region = relationship("Region", back_populates="grievances")
    feedback = relationship("Feedback", uselist=False, back_populates="grievance")
    media = relationship("Media", back_populates="grievance")
    timeline = relationship("Timeline", back_populates="grievance")

class Media(Base):
    __tablename__ = "media"

    id = Column(Integer, primary_key=True, index=True)
    grievance_id = Column(Integer, ForeignKey("grievances.id"))
    url = Column(String)
    uploader_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    type = Column(String) # image, video, document
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    grievance = relationship("Grievance", back_populates="media")

class Timeline(Base):
    __tablename__ = "timeline"

    id = Column(Integer, primary_key=True, index=True)
    grievance_id = Column(Integer, ForeignKey("grievances.id"))
    status = Column(String)
    remark = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    grievance = relationship("Grievance", back_populates="timeline")

class Feedback(Base):
    __tablename__ = "feedback"

    id = Column(Integer, primary_key=True, index=True)
    grievance_id = Column(Integer, ForeignKey("grievances.id"), unique=True)
    rating = Column(Integer)
    comment = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    grievance = relationship("Grievance", back_populates="feedback")
