const bcrypt = require('bcrypt');
const { sequelize } = require('./db.config');
const dotenv = require('dotenv');

dotenv.config();

const seedDatabase = async () => {
  try {
    console.log('Starting database seeding...');

    // Variable for timestamps
    let now = new Date();

    // Hash passwords
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('admin123', salt);
    const tutorPassword = await bcrypt.hash('tutor123', salt);
    const studentPassword = await bcrypt.hash('student123', salt);

    // Check if admin user already exists
    const [adminCheck] = await sequelize.query(
      `SELECT id FROM users WHERE email = ?`,
      {
        replacements: ['admin@helloenglishcoaching.com'],
        type: sequelize.QueryTypes.SELECT
      }
    );

    let adminId;

    // Insert users
    console.log('Inserting users...');
    if (!adminCheck || adminCheck.length === 0) {
      const now = new Date();
      const [adminResult] = await sequelize.query(
        `INSERT INTO users (email, password, first_name, last_name, role, profile_image, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        {
          replacements: ['admin@helloenglishcoaching.com', adminPassword, 'Admin', 'User', 'admin', null, now, now],
          type: sequelize.QueryTypes.INSERT
        }
      );
      adminId = adminResult;
    } else {
      adminId = adminCheck.id;
      console.log('Admin user already exists, skipping creation.');
    }

    // Check if tutor user already exists
    const [tutorCheck] = await sequelize.query(
      `SELECT id FROM users WHERE email = ?`,
      {
        replacements: ['tutor@helloenlishcoaching.com'],
        type: sequelize.QueryTypes.SELECT
      }
    );

    let tutorId;

    if (!tutorCheck || tutorCheck.length === 0) {
      const now = new Date();
      const [tutorResult] = await sequelize.query(
        `INSERT INTO users (email, password, first_name, last_name, role, profile_image, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        {
          replacements: ['tutor@helloenlishcoaching.com', tutorPassword, 'John', 'Doe', 'tutor', null, now, now],
          type: sequelize.QueryTypes.INSERT
        }
      );
      tutorId = tutorResult;
    } else {
      tutorId = tutorCheck.id;
      console.log('Tutor user already exists, skipping creation.');
    }

    // Check if student user already exists
    const [studentCheck] = await sequelize.query(
      `SELECT id FROM users WHERE email = ?`,
      {
        replacements: ['student@helloenlishcoaching.com'],
        type: sequelize.QueryTypes.SELECT
      }
    );

    let studentId;

    if (!studentCheck || studentCheck.length === 0) {
      const now = new Date();
      const [studentResult] = await sequelize.query(
        `INSERT INTO users (email, password, first_name, last_name, role, profile_image, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        {
          replacements: ['student@helloenlishcoaching.com', studentPassword, 'Jane', 'Smith', 'student', null, now, now],
          type: sequelize.QueryTypes.INSERT
        }
      );
      studentId = studentResult;
    } else {
      studentId = studentCheck.id;
      console.log('Student user already exists, skipping creation.');
    }

    // Insert profiles if they don't exist
    console.log('Inserting profiles...');

    // Check if admin profile exists
    const [adminProfileCheck] = await sequelize.query(
      `SELECT id FROM admin_profiles WHERE user_id = ?`,
      {
        replacements: [adminId],
        type: sequelize.QueryTypes.SELECT
      }
    );

    if (!adminProfileCheck || adminProfileCheck.length === 0) {
      const now = new Date();
      await sequelize.query(
        `INSERT INTO admin_profiles (user_id, department, created_at, updated_at) VALUES (?, ?, ?, ?)`,
        {
          replacements: [adminId, 'Management', now, now],
          type: sequelize.QueryTypes.INSERT
        }
      );
    } else {
      console.log('Admin profile already exists, skipping creation.');
    }

    // Check if tutor profile exists
    const [tutorProfileCheck] = await sequelize.query(
      `SELECT id FROM tutor_profiles WHERE user_id = ?`,
      {
        replacements: [tutorId],
        type: sequelize.QueryTypes.SELECT
      }
    );

    if (!tutorProfileCheck || tutorProfileCheck.length === 0) {
      const now = new Date();
      await sequelize.query(
        `INSERT INTO tutor_profiles (user_id, bio, specialization, experience, hourly_rate, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        {
          replacements: [tutorId, 'Experienced English tutor with a passion for teaching.', 'Conversation', 5, 25.00, now, now],
          type: sequelize.QueryTypes.INSERT
        }
      );
    } else {
      console.log('Tutor profile already exists, skipping creation.');
    }

    // Check if student profile exists
    const [studentProfileCheck] = await sequelize.query(
      `SELECT id FROM student_profiles WHERE user_id = ?`,
      {
        replacements: [studentId],
        type: sequelize.QueryTypes.SELECT
      }
    );

    if (!studentProfileCheck || studentProfileCheck.length === 0) {
      const now = new Date();
      await sequelize.query(
        `INSERT INTO student_profiles (user_id, level, learning_goals, interests, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?)`,
        {
          replacements: [studentId, 'Intermediate', 'Improve conversation skills', 'Reading, Music, Travel', now, now],
          type: sequelize.QueryTypes.INSERT
        }
      );
    } else {
      console.log('Student profile already exists, skipping creation.');
    }

    // Insert skins
    console.log('Inserting skins...');
    const lightTheme = {
      backgroundColor: '#ffffff',
      textColor: '#333333',
      headingColor: '#2c3e50',
      accentColor: '#3498db',
      fontFamily: 'Arial, sans-serif',
      borderRadius: '5px',
      boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
    };

    const darkTheme = {
      backgroundColor: '#2c3e50',
      textColor: '#ecf0f1',
      headingColor: '#3498db',
      accentColor: '#e74c3c',
      fontFamily: 'Roboto, sans-serif',
      borderRadius: '3px',
      boxShadow: '0 3px 6px rgba(0,0,0,0.2)'
    };

    const vintageTheme = {
      backgroundColor: '#f9f3e9',
      textColor: '#5d4037',
      headingColor: '#8d6e63',
      accentColor: '#a1887f',
      fontFamily: 'Georgia, serif',
      borderRadius: '0px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
    };

    // Check if skins already exist
    const [skin1Check] = await sequelize.query(
      `SELECT id FROM skins WHERE name = ?`,
      {
        replacements: ['Light Theme'],
        type: sequelize.QueryTypes.SELECT
      }
    );

    let skin1Id;

    if (!skin1Check || skin1Check.length === 0) {
      const now = new Date();
      const [skin1Result] = await sequelize.query(
        `INSERT INTO skins (name, description, theme_data, created_by, is_public, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        {
          replacements: ['Light Theme', 'A clean, light theme with blue accents', JSON.stringify(lightTheme), adminId, true, now, now],
          type: sequelize.QueryTypes.INSERT
        }
      );
      skin1Id = skin1Result;
    } else {
      skin1Id = skin1Check.id;
      console.log('Light Theme skin already exists, skipping creation.');
    }

    const [skin2Check] = await sequelize.query(
      `SELECT id FROM skins WHERE name = ?`,
      {
        replacements: ['Dark Theme'],
        type: sequelize.QueryTypes.SELECT
      }
    );

    let skin2Id;

    if (!skin2Check || skin2Check.length === 0) {
      const now = new Date();
      const [skin2Result] = await sequelize.query(
        `INSERT INTO skins (name, description, theme_data, created_by, is_public, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        {
          replacements: ['Dark Theme', 'A sleek, dark theme with red accents', JSON.stringify(darkTheme), tutorId, true, now, now],
          type: sequelize.QueryTypes.INSERT
        }
      );
      skin2Id = skin2Result;
    } else {
      skin2Id = skin2Check.id;
      console.log('Dark Theme skin already exists, skipping creation.');
    }

    const [skin3Check] = await sequelize.query(
      `SELECT id FROM skins WHERE name = ?`,
      {
        replacements: ['Vintage Theme'],
        type: sequelize.QueryTypes.SELECT
      }
    );

    let skin3Id;

    if (!skin3Check || skin3Check.length === 0) {
      const now = new Date();
      const [skin3Result] = await sequelize.query(
        `INSERT INTO skins (name, description, theme_data, created_by, is_public, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        {
          replacements: ['Vintage Theme', 'A warm, vintage theme with brown accents', JSON.stringify(vintageTheme), studentId, false, now, now],
          type: sequelize.QueryTypes.INSERT
        }
      );
      skin3Id = skin3Result;
    } else {
      skin3Id = skin3Check.id;
      console.log('Vintage Theme skin already exists, skipping creation.');
    }

    // Insert diaries
    console.log('Inserting diaries...');

    // Check if diaries already exist
    const [diary1Check] = await sequelize.query(
      `SELECT id FROM diaries WHERE user_id = ? AND title = ?`,
      {
        replacements: [studentId, 'My Learning Journey'],
        type: sequelize.QueryTypes.SELECT
      }
    );

    let diary1Id;

    if (!diary1Check || diary1Check.length === 0) {
      const now = new Date();
      const [diary1Result] = await sequelize.query(
        `INSERT INTO diaries (user_id, title, description, is_public, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?)`,
        {
          replacements: [studentId, 'My Learning Journey', 'Documenting my progress in learning English', true, now, now],
          type: sequelize.QueryTypes.INSERT
        }
      );
      diary1Id = diary1Result;
    } else {
      diary1Id = diary1Check.id;
      console.log('My Learning Journey diary already exists, skipping creation.');
    }

    const [diary2Check] = await sequelize.query(
      `SELECT id FROM diaries WHERE user_id = ? AND title = ?`,
      {
        replacements: [studentId, 'Vocabulary Notes'],
        type: sequelize.QueryTypes.SELECT
      }
    );

    let diary2Id;

    if (!diary2Check || diary2Check.length === 0) {
      const now = new Date();
      const [diary2Result] = await sequelize.query(
        `INSERT INTO diaries (user_id, title, description, is_public, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?)`,
        {
          replacements: [studentId, 'Vocabulary Notes', 'New words I learn each day', false, now, now],
          type: sequelize.QueryTypes.INSERT
        }
      );
      diary2Id = diary2Result;
    } else {
      diary2Id = diary2Check.id;
      console.log('Vocabulary Notes diary already exists, skipping creation.');
    }

    const [diary3Check] = await sequelize.query(
      `SELECT id FROM diaries WHERE user_id = ? AND title = ?`,
      {
        replacements: [tutorId, 'Teaching Reflections'],
        type: sequelize.QueryTypes.SELECT
      }
    );

    let diary3Id;

    if (!diary3Check || diary3Check.length === 0) {
      const now = new Date();
      const [diary3Result] = await sequelize.query(
        `INSERT INTO diaries (user_id, title, description, is_public, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?)`,
        {
          replacements: [tutorId, 'Teaching Reflections', 'My thoughts on teaching methods and student progress', true, now, now],
          type: sequelize.QueryTypes.INSERT
        }
      );
      diary3Id = diary3Result;
    } else {
      diary3Id = diary3Check.id;
      console.log('Teaching Reflections diary already exists, skipping creation.');
    }

    // Insert diary pages
    console.log('Inserting diary pages...');

    // Check if diary pages already exist
    const [page1Check] = await sequelize.query(
      `SELECT id FROM diary_pages WHERE diary_id = ? AND page_number = ?`,
      {
        replacements: [diary1Id, 1],
        type: sequelize.QueryTypes.SELECT
      }
    );

    if (!page1Check || page1Check.length === 0) {
      const now = new Date();
      await sequelize.query(
        `INSERT INTO diary_pages (diary_id, title, content, page_number, skin_id, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        {
          replacements: [diary1Id, 'First Day', 'Today was my first day of English class. I was nervous but excited. The teacher seems nice and the other students are friendly. We learned basic introductions and greetings.', 1, skin1Id, now, now],
          type: sequelize.QueryTypes.INSERT
        }
      );
    } else {
      console.log('First Day diary page already exists, skipping creation.');
    }

    const [page2Check] = await sequelize.query(
      `SELECT id FROM diary_pages WHERE diary_id = ? AND page_number = ?`,
      {
        replacements: [diary1Id, 2],
        type: sequelize.QueryTypes.SELECT
      }
    );

    if (!page2Check || page2Check.length === 0) {
      const now = new Date();
      await sequelize.query(
        `INSERT INTO diary_pages (diary_id, title, content, page_number, skin_id, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        {
          replacements: [diary1Id, 'One Week Later', 'After a week of classes, I feel more confident. I can introduce myself and have simple conversations. I still struggle with pronunciation, but I\'m improving every day.', 2, skin2Id, now, now],
          type: sequelize.QueryTypes.INSERT
        }
      );
    } else {
      console.log('One Week Later diary page already exists, skipping creation.');
    }

    const [page3Check] = await sequelize.query(
      `SELECT id FROM diary_pages WHERE diary_id = ? AND page_number = ?`,
      {
        replacements: [diary1Id, 3],
        type: sequelize.QueryTypes.SELECT
      }
    );

    if (!page3Check || page3Check.length === 0) {
      const now = new Date();
      await sequelize.query(
        `INSERT INTO diary_pages (diary_id, title, content, page_number, skin_id, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        {
          replacements: [diary1Id, 'First Month Review', 'It\'s been a month since I started learning English. I can now have basic conversations about everyday topics. My vocabulary has expanded, and I\'m getting better at understanding native speakers.', 3, skin3Id, now, now],
          type: sequelize.QueryTypes.INSERT
        }
      );
    } else {
      console.log('First Month Review diary page already exists, skipping creation.');
    }

    const [page4Check] = await sequelize.query(
      `SELECT id FROM diary_pages WHERE diary_id = ? AND page_number = ?`,
      {
        replacements: [diary2Id, 1],
        type: sequelize.QueryTypes.SELECT
      }
    );

    if (!page4Check || page4Check.length === 0) {
      const now = new Date();
      await sequelize.query(
        `INSERT INTO diary_pages (diary_id, title, content, page_number, skin_id, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        {
          replacements: [diary2Id, 'Animals', 'Dog - a domesticated carnivorous mammal\nCat - a small domesticated carnivorous mammal\nElephant - a very large plant-eating mammal with a long trunk', 1, skin1Id, now, now],
          type: sequelize.QueryTypes.INSERT
        }
      );
    } else {
      console.log('Animals diary page already exists, skipping creation.');
    }

    const [page5Check] = await sequelize.query(
      `SELECT id FROM diary_pages WHERE diary_id = ? AND page_number = ?`,
      {
        replacements: [diary2Id, 2],
        type: sequelize.QueryTypes.SELECT
      }
    );

    if (!page5Check || page5Check.length === 0) {
      const now = new Date();
      await sequelize.query(
        `INSERT INTO diary_pages (diary_id, title, content, page_number, skin_id, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        {
          replacements: [diary2Id, 'Food', 'Apple - a round fruit with red, yellow, or green skin\nBread - a staple food made from flour and water\nCheese - a food made from the pressed curds of milk', 2, skin1Id, now, now],
          type: sequelize.QueryTypes.INSERT
        }
      );
    } else {
      console.log('Food diary page already exists, skipping creation.');
    }

    const [page6Check] = await sequelize.query(
      `SELECT id FROM diary_pages WHERE diary_id = ? AND page_number = ?`,
      {
        replacements: [diary3Id, 1],
        type: sequelize.QueryTypes.SELECT
      }
    );

    if (!page6Check || page6Check.length === 0) {
      const now = new Date();
      await sequelize.query(
        `INSERT INTO diary_pages (diary_id, title, content, page_number, skin_id, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        {
          replacements: [diary3Id, 'Teaching Methods', 'I\'ve found that using visual aids and real-life examples helps students grasp concepts more quickly. Interactive activities also keep them engaged and make learning more enjoyable.', 1, skin2Id, now, now],
          type: sequelize.QueryTypes.INSERT
        }
      );
    } else {
      console.log('Teaching Methods diary page already exists, skipping creation.');
    }

    // Insert awards
    console.log('Inserting awards...');
    now = new Date();
    const [award1Result] = await sequelize.query(
      `INSERT INTO awards (name, description, image_url, points, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      {
        replacements: ['Vocabulary Master', 'Awarded for learning 100 new words', '/uploads/images/vocabulary-master.png', 50, now, now],
        type: sequelize.QueryTypes.INSERT
      }
    );
    const award1Id = award1Result;

    const [award2Result] = await sequelize.query(
      `INSERT INTO awards (name, description, image_url, points, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      {
        replacements: ['Grammar Guru', 'Awarded for mastering advanced grammar concepts', '/uploads/images/grammar-guru.png', 75, now, now],
        type: sequelize.QueryTypes.INSERT
      }
    );
    const award2Id = award2Result;

    const [award3Result] = await sequelize.query(
      `INSERT INTO awards (name, description, image_url, points, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      {
        replacements: ['Conversation Champion', 'Awarded for excellent speaking skills', '/uploads/images/conversation-champion.png', 100, now, now],
        type: sequelize.QueryTypes.INSERT
      }
    );
    const award3Id = award3Result;

    // Assign awards to users
    console.log('Assigning awards to users...');
    now = new Date();
    await sequelize.query(
      `INSERT INTO user_awards (user_id, award_id, created_at, updated_at)
       VALUES (?, ?, ?, ?)`,
      {
        replacements: [studentId, award1Id, now, now],
        type: sequelize.QueryTypes.INSERT
      }
    );

    await sequelize.query(
      `INSERT INTO user_awards (user_id, award_id, created_at, updated_at)
       VALUES (?, ?, ?, ?)`,
      {
        replacements: [studentId, award2Id, now, now],
        type: sequelize.QueryTypes.INSERT
      }
    );

    // Use award3Id as well to avoid the unused variable warning
    await sequelize.query(
      `INSERT INTO user_awards (user_id, award_id, created_at, updated_at)
       VALUES (?, ?, ?, ?)`,
      {
        replacements: [tutorId, award3Id, now, now],
        type: sequelize.QueryTypes.INSERT
      }
    );

    // Insert forums
    console.log('Inserting forums...');
    now = new Date();
    const [forum1Result] = await sequelize.query(
      `INSERT INTO forums (name, description, created_by, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?)`,
      {
        replacements: ['General Discussion', 'A place to discuss anything related to English learning', adminId, now, now],
        type: sequelize.QueryTypes.INSERT
      }
    );
    const forum1Id = forum1Result;

    const [forum2Result] = await sequelize.query(
      `INSERT INTO forums (name, description, created_by, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?)`,
      {
        replacements: ['Grammar Help', 'Get help with English grammar', adminId, now, now],
        type: sequelize.QueryTypes.INSERT
      }
    );
    const forum2Id = forum2Result;

    // Insert forum topics
    console.log('Inserting forum topics...');
    now = new Date();
    const [topic1Result] = await sequelize.query(
      `INSERT INTO forum_topics (forum_id, title, content, created_by, is_pinned, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      {
        replacements: [forum1Id, 'Welcome to the Forum!', 'Welcome to our English learning community! Feel free to introduce yourself and share your learning goals.', adminId, true, now, now],
        type: sequelize.QueryTypes.INSERT
      }
    );
    const topic1Id = topic1Result;

    const [topic2Result] = await sequelize.query(
      `INSERT INTO forum_topics (forum_id, title, content, created_by, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      {
        replacements: [forum2Id, 'Present Perfect vs. Simple Past', 'I\'m confused about when to use the present perfect tense versus the simple past tense. Can someone explain the difference with examples?', studentId, now, now],
        type: sequelize.QueryTypes.INSERT
      }
    );
    const topic2Id = topic2Result;

    // Insert forum posts
    console.log('Inserting forum posts...');
    now = new Date();
    await sequelize.query(
      `INSERT INTO forum_posts (topic_id, content, created_by, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?)`,
      {
        replacements: [topic1Id, 'Hi everyone! I\'m Jane, and I\'m learning English to prepare for my studies abroad. Looking forward to learning with all of you!', studentId, now, now],
        type: sequelize.QueryTypes.INSERT
      }
    );

    await sequelize.query(
      `INSERT INTO forum_posts (topic_id, content, created_by, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?)`,
      {
        replacements: [topic2Id, 'Great question! The present perfect is used for actions that started in the past and continue to the present or have a connection to the present. For example: "I have lived in London for five years" (and I still live there). The simple past is used for completed actions in the past. For example: "I lived in London for five years" (but I don\'t live there anymore).', tutorId, now, now],
        type: sequelize.QueryTypes.INSERT
      }
    );

    // Insert chats
    console.log('Inserting chats...');
    now = new Date();
    const [chat1Result] = await sequelize.query(
      `INSERT INTO chats (name, is_group, created_by, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?)`,
      {
        replacements: [null, false, studentId, now, now],
        type: sequelize.QueryTypes.INSERT
      }
    );
    const chat1Id = chat1Result;

    const [chat2Result] = await sequelize.query(
      `INSERT INTO chats (name, is_group, created_by, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?)`,
      {
        replacements: ['Study Group', true, tutorId, now, now],
        type: sequelize.QueryTypes.INSERT
      }
    );
    const chat2Id = chat2Result;

    // Insert chat participants
    console.log('Inserting chat participants...');
    now = new Date();
    await sequelize.query(
      `INSERT INTO chat_participants (chat_id, user_id, created_at, updated_at)
       VALUES (?, ?, ?, ?)`,
      {
        replacements: [chat1Id, studentId, now, now],
        type: sequelize.QueryTypes.INSERT
      }
    );

    await sequelize.query(
      `INSERT INTO chat_participants (chat_id, user_id, created_at, updated_at)
       VALUES (?, ?, ?, ?)`,
      {
        replacements: [chat1Id, tutorId, now, now],
        type: sequelize.QueryTypes.INSERT
      }
    );

    await sequelize.query(
      `INSERT INTO chat_participants (chat_id, user_id, created_at, updated_at)
       VALUES (?, ?, ?, ?)`,
      {
        replacements: [chat2Id, tutorId, now, now],
        type: sequelize.QueryTypes.INSERT
      }
    );

    await sequelize.query(
      `INSERT INTO chat_participants (chat_id, user_id, created_at, updated_at)
       VALUES (?, ?, ?, ?)`,
      {
        replacements: [chat2Id, studentId, now, now],
        type: sequelize.QueryTypes.INSERT
      }
    );

    await sequelize.query(
      `INSERT INTO chat_participants (chat_id, user_id, created_at, updated_at)
       VALUES (?, ?, ?, ?)`,
      {
        replacements: [chat2Id, adminId, now, now],
        type: sequelize.QueryTypes.INSERT
      }
    );

    // Insert messages
    console.log('Inserting messages...');
    now = new Date();
    await sequelize.query(
      `INSERT INTO messages (chat_id, sender_id, content, created_at)
       VALUES (?, ?, ?, ?)`,
      {
        replacements: [chat1Id, studentId, 'Hello! I have a question about my homework.', now],
        type: sequelize.QueryTypes.INSERT
      }
    );

    await sequelize.query(
      `INSERT INTO messages (chat_id, sender_id, content, created_at)
       VALUES (?, ?, ?, ?)`,
      {
        replacements: [chat1Id, tutorId, 'Hi Jane! What can I help you with?', now],
        type: sequelize.QueryTypes.INSERT
      }
    );

    await sequelize.query(
      `INSERT INTO messages (chat_id, sender_id, content, created_at)
       VALUES (?, ?, ?, ?)`,
      {
        replacements: [chat2Id, tutorId, 'Welcome to our study group! We\'ll use this chat to coordinate our group sessions.', now],
        type: sequelize.QueryTypes.INSERT
      }
    );

    await sequelize.query(
      `INSERT INTO messages (chat_id, sender_id, content, created_at)
       VALUES (?, ?, ?, ?)`,
      {
        replacements: [chat2Id, studentId, 'Thanks for adding me to the group!', now],
        type: sequelize.QueryTypes.INSERT
      }
    );

    await sequelize.query(
      `INSERT INTO messages (chat_id, sender_id, content, created_at)
       VALUES (?, ?, ?, ?)`,
      {
        replacements: [chat2Id, adminId, 'Let me know if you need any resources for your study sessions.', now],
        type: sequelize.QueryTypes.INSERT
      }
    );

    console.log('Database seeding completed successfully!');
    return true;
  } catch (error) {
    console.error('Error seeding database:', error);
    return false;
  }
};

// Run the seeding if this script is executed directly
if (require.main === module) {
  seedDatabase()
    .then(success => {
      if (success) {
        console.log('Database seeding completed successfully');
      } else {
        console.error('Database seeding failed');
      }
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('Unexpected error during database seeding:', error);
      process.exit(1);
    });
}

module.exports = { seedDatabase };
