from sqlalchemy import Column, String, Integer, Date, Boolean, ForeignKey, Text, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
import enum
import datetime

from app.database import Base
# -----------------------
# ENUM for opportunity types
# -----------------------
class OpportunityType(str, enum.Enum):
    competition = "competition"
    scholarship = "scholarship"
    event = "event"
    club = "club"

# -----------------------
# USERS
# -----------------------
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    created_at = Column(Date, default=datetime.date.today)
    name = Column(String)
    surname = Column(String)
    school = Column(String)
    username = Column(String, unique=True)
    vovoideship = Column(String)

    # Relationships
    personality = relationship("UserPersonality", back_populates="user", uselist=False)
    streak = relationship("UserStreak", back_populates="user", uselist=False)
    xp = relationship("UserXP", back_populates="user", uselist=False)
    goals = relationship("Goal", back_populates="user")
    flashcard_sets = relationship("FlashcardSet", back_populates="user")

# -----------------------
# USER_PERSONALITY
# -----------------------
class UserPersonality(Base):
    __tablename__ = "user_personality"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    learning_style = Column(String)
    personality = Column(String)
    motivation_rules = Column(Text)
    top_intelligences = Column(Text)
    social_focus = Column(String)
    communication_style = Column(String)
    goals = Column(Text)

    user = relationship("User", back_populates="personality")

# -----------------------
# USER_XP
# -----------------------
class UserXP(Base):
    __tablename__ = "user_xp"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    xp_amount = Column(Integer, default=0)
    level = Column(Integer, default=1)
    last_updated = Column(Date, default=datetime.date.today)

    user = relationship("User", back_populates="xp")

# -----------------------
# USER_STREAK
# -----------------------
class UserStreak(Base):
    __tablename__ = "user_streak"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    streak_days = Column(Integer, default=0)
    last_active_date = Column(Date)

    user = relationship("User", back_populates="streak")

# -----------------------
# GOAL
# -----------------------
class Goal(Base):
    __tablename__ = "goal"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String)
    completion_date = Column(Date)
    created_at = Column(Date, default=datetime.date.today)

    user = relationship("User", back_populates="goals")
    tasks = relationship("Task", back_populates="goal")

# -----------------------
# TASK
# -----------------------
class Task(Base):
    __tablename__ = "task"

    id = Column(Integer, primary_key=True)
    goal_id = Column(Integer, ForeignKey("goal.id"))
    title = Column(String)
    subject = Column(String)
    priority = Column(Integer)
    is_completed = Column(Boolean, default=False)
    due_date = Column(Date)
    created_at = Column(Date, default=datetime.date.today)

    goal = relationship("Goal", back_populates="tasks")

# -----------------------
# FLASHCARD_SET
# -----------------------
class FlashcardSet(Base):
    __tablename__ = "flashcard_set"

    id = Column(Integer, primary_key=True)
    title = Column(String)
    user_id = Column(Integer, ForeignKey("users.id"))

    user = relationship("User", back_populates="flashcard_sets")
    flashcards = relationship("Flashcard", back_populates="flashcard_set")

# -----------------------
# FLASHCARDS
# -----------------------
class Flashcard(Base):
    __tablename__ = "flashcards"

    id = Column(Integer, primary_key=True)
    flashCardSetId = Column(Integer, ForeignKey("flashcard_set.id"))
    question = Column(Text)
    answer = Column(Text)
    isLearned = Column(Boolean, default=False)

    flashcard_set = relationship("FlashcardSet", back_populates="flashcards")

# -----------------------
# OPPORTUNITIES
# -----------------------
class Opportunity(Base):
    __tablename__ = "opportunities"

    id = Column(Integer, primary_key=True)
    title = Column(String)
    type = Column(Enum(OpportunityType))
    description = Column(Text)
    location = Column(String)
    date = Column(Date)
    created_at = Column(Date, default=datetime.date.today)
    link = Column(String)
    target_audience = Column(String)
