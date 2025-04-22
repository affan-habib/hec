const bcrypt = require('bcrypt');
const { pool } = require('./db.config');
const dotenv = require('dotenv');

dotenv.config();

const seedDatabase = async () => {
  try {
    console.log('Starting database seeding...');

    // Hash passwords
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('admin123', salt);
    const tutorPassword = await bcrypt.hash('tutor123', salt);
    const studentPassword = await bcrypt.hash('student123', salt);

    // Check if admin user already exists
    const [adminCheck] = await pool.query(
      `SELECT id FROM users WHERE email = ?`,
      ['admin@helloenlishcoaching.com']
    );

    let adminId;

    // Insert users
    console.log('Inserting users...');
    if (adminCheck.length === 0) {
      const [adminResult] = await pool.query(
        `INSERT INTO users (email, password, first_name, last_name, role, profile_image)
         VALUES (?, ?, ?, ?, ?, ?)`,
        ['admin@helloenlishcoaching.com', adminPassword, 'Admin', 'User', 'admin', null]
      );
      adminId = adminResult.insertId;
    } else {
      adminId = adminCheck[0].id;
      console.log('Admin user already exists, skipping creation.');
    }

    // Check if tutor user already exists
    const [tutorCheck] = await pool.query(
      `SELECT id FROM users WHERE email = ?`,
      ['tutor@helloenlishcoaching.com']
    );

    let tutorId;

    if (tutorCheck.length === 0) {
      const [tutorResult] = await pool.query(
        `INSERT INTO users (email, password, first_name, last_name, role, profile_image)
         VALUES (?, ?, ?, ?, ?, ?)`,
        ['tutor@helloenlishcoaching.com', tutorPassword, 'John', 'Doe', 'tutor', null]
      );
      tutorId = tutorResult.insertId;
    } else {
      tutorId = tutorCheck[0].id;
      console.log('Tutor user already exists, skipping creation.');
    }

    // Check if student user already exists
    const [studentCheck] = await pool.query(
      `SELECT id FROM users WHERE email = ?`,
      ['student@helloenlishcoaching.com']
    );

    let studentId;

    if (studentCheck.length === 0) {
      const [studentResult] = await pool.query(
        `INSERT INTO users (email, password, first_name, last_name, role, profile_image)
         VALUES (?, ?, ?, ?, ?, ?)`,
        ['student@helloenlishcoaching.com', studentPassword, 'Jane', 'Smith', 'student', null]
      );
      studentId = studentResult.insertId;
    } else {
      studentId = studentCheck[0].id;
      console.log('Student user already exists, skipping creation.');
    }

    // Insert profiles if they don't exist
    console.log('Inserting profiles...');

    // Check if admin profile exists
    const [adminProfileCheck] = await pool.query(
      `SELECT id FROM admin_profiles WHERE user_id = ?`,
      [adminId]
    );

    if (adminProfileCheck.length === 0) {
      await pool.query(
        `INSERT INTO admin_profiles (user_id, department) VALUES (?, ?)`,
        [adminId, 'Management']
      );
    } else {
      console.log('Admin profile already exists, skipping creation.');
    }

    // Check if tutor profile exists
    const [tutorProfileCheck] = await pool.query(
      `SELECT id FROM tutor_profiles WHERE user_id = ?`,
      [tutorId]
    );

    if (tutorProfileCheck.length === 0) {
      await pool.query(
        `INSERT INTO tutor_profiles (user_id, bio, specialization, experience, hourly_rate)
         VALUES (?, ?, ?, ?, ?)`,
        [tutorId, 'Experienced English tutor with a passion for teaching.', 'Conversation', 5, 25.00]
      );
    } else {
      console.log('Tutor profile already exists, skipping creation.');
    }

    // Check if student profile exists
    const [studentProfileCheck] = await pool.query(
      `SELECT id FROM student_profiles WHERE user_id = ?`,
      [studentId]
    );

    if (studentProfileCheck.length === 0) {
      await pool.query(
        `INSERT INTO student_profiles (user_id, level, learning_goals, interests)
         VALUES (?, ?, ?, ?)`,
        [studentId, 'Intermediate', 'Improve conversation skills', 'Reading, Music, Travel']
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
    const [skin1Check] = await pool.query(
      `SELECT id FROM skins WHERE name = ?`,
      ['Light Theme']
    );

    let skin1Id;

    if (skin1Check.length === 0) {
      const [skin1Result] = await pool.query(
        `INSERT INTO skins (name, description, theme_data, created_by, is_public)
         VALUES (?, ?, ?, ?, ?)`,
        ['Light Theme', 'A clean, light theme with blue accents', JSON.stringify(lightTheme), adminId, true]
      );
      skin1Id = skin1Result.insertId;
    } else {
      skin1Id = skin1Check[0].id;
      console.log('Light Theme skin already exists, skipping creation.');
    }

    const [skin2Check] = await pool.query(
      `SELECT id FROM skins WHERE name = ?`,
      ['Dark Theme']
    );

    let skin2Id;

    if (skin2Check.length === 0) {
      const [skin2Result] = await pool.query(
        `INSERT INTO skins (name, description, theme_data, created_by, is_public)
         VALUES (?, ?, ?, ?, ?)`,
        ['Dark Theme', 'A sleek, dark theme with red accents', JSON.stringify(darkTheme), tutorId, true]
      );
      skin2Id = skin2Result.insertId;
    } else {
      skin2Id = skin2Check[0].id;
      console.log('Dark Theme skin already exists, skipping creation.');
    }

    const [skin3Check] = await pool.query(
      `SELECT id FROM skins WHERE name = ?`,
      ['Vintage Theme']
    );

    let skin3Id;

    if (skin3Check.length === 0) {
      const [skin3Result] = await pool.query(
        `INSERT INTO skins (name, description, theme_data, created_by, is_public)
         VALUES (?, ?, ?, ?, ?)`,
        ['Vintage Theme', 'A warm, vintage theme with brown accents', JSON.stringify(vintageTheme), studentId, false]
      );
      skin3Id = skin3Result.insertId;
    } else {
      skin3Id = skin3Check[0].id;
      console.log('Vintage Theme skin already exists, skipping creation.');
    }

    // Insert diaries
    console.log('Inserting diaries...');

    // Check if diaries already exist
    const [diary1Check] = await pool.query(
      `SELECT id FROM diaries WHERE user_id = ? AND title = ?`,
      [studentId, 'My Learning Journey']
    );

    let diary1Id;

    if (diary1Check.length === 0) {
      const [diary1Result] = await pool.query(
        `INSERT INTO diaries (user_id, title, description, is_public)
         VALUES (?, ?, ?, ?)`,
        [studentId, 'My Learning Journey', 'Documenting my progress in learning English', true]
      );
      diary1Id = diary1Result.insertId;
    } else {
      diary1Id = diary1Check[0].id;
      console.log('My Learning Journey diary already exists, skipping creation.');
    }

    const [diary2Check] = await pool.query(
      `SELECT id FROM diaries WHERE user_id = ? AND title = ?`,
      [studentId, 'Vocabulary Notes']
    );

    let diary2Id;

    if (diary2Check.length === 0) {
      const [diary2Result] = await pool.query(
        `INSERT INTO diaries (user_id, title, description, is_public)
         VALUES (?, ?, ?, ?)`,
        [studentId, 'Vocabulary Notes', 'New words I learn each day', false]
      );
      diary2Id = diary2Result.insertId;
    } else {
      diary2Id = diary2Check[0].id;
      console.log('Vocabulary Notes diary already exists, skipping creation.');
    }

    const [diary3Check] = await pool.query(
      `SELECT id FROM diaries WHERE user_id = ? AND title = ?`,
      [tutorId, 'Teaching Reflections']
    );

    let diary3Id;

    if (diary3Check.length === 0) {
      const [diary3Result] = await pool.query(
        `INSERT INTO diaries (user_id, title, description, is_public)
         VALUES (?, ?, ?, ?)`,
        [tutorId, 'Teaching Reflections', 'My thoughts on teaching methods and student progress', true]
      );
      diary3Id = diary3Result.insertId;
    } else {
      diary3Id = diary3Check[0].id;
      console.log('Teaching Reflections diary already exists, skipping creation.');
    }

    // Insert diary pages
    console.log('Inserting diary pages...');

    // Check if diary pages already exist
    const [page1Check] = await pool.query(
      `SELECT id FROM diary_pages WHERE diary_id = ? AND page_number = ?`,
      [diary1Id, 1]
    );

    if (page1Check.length === 0) {
      await pool.query(
        `INSERT INTO diary_pages (diary_id, title, content, page_number, skin_id)
         VALUES (?, ?, ?, ?, ?)`,
        [diary1Id, 'First Day', 'Today was my first day of English class. I was nervous but excited. The teacher seems nice and the other students are friendly. We learned basic introductions and greetings.', 1, skin1Id]
      );
    } else {
      console.log('First Day diary page already exists, skipping creation.');
    }

    const [page2Check] = await pool.query(
      `SELECT id FROM diary_pages WHERE diary_id = ? AND page_number = ?`,
      [diary1Id, 2]
    );

    if (page2Check.length === 0) {
      await pool.query(
        `INSERT INTO diary_pages (diary_id, title, content, page_number, skin_id)
         VALUES (?, ?, ?, ?, ?)`,
        [diary1Id, 'One Week Later', 'After a week of classes, I feel more confident. I can introduce myself and have simple conversations. I still struggle with pronunciation, but I\'m improving every day.', 2, skin2Id]
      );
    } else {
      console.log('One Week Later diary page already exists, skipping creation.');
    }

    const [page3Check] = await pool.query(
      `SELECT id FROM diary_pages WHERE diary_id = ? AND page_number = ?`,
      [diary1Id, 3]
    );

    if (page3Check.length === 0) {
      await pool.query(
        `INSERT INTO diary_pages (diary_id, title, content, page_number, skin_id)
         VALUES (?, ?, ?, ?, ?)`,
        [diary1Id, 'First Month Review', 'It\'s been a month since I started learning English. I can now have basic conversations about everyday topics. My vocabulary has expanded, and I\'m getting better at understanding native speakers.', 3, skin3Id]
      );
    } else {
      console.log('First Month Review diary page already exists, skipping creation.');
    }

    const [page4Check] = await pool.query(
      `SELECT id FROM diary_pages WHERE diary_id = ? AND page_number = ?`,
      [diary2Id, 1]
    );

    if (page4Check.length === 0) {
      await pool.query(
        `INSERT INTO diary_pages (diary_id, title, content, page_number, skin_id)
         VALUES (?, ?, ?, ?, ?)`,
        [diary2Id, 'Animals', 'Dog - a domesticated carnivorous mammal\nCat - a small domesticated carnivorous mammal\nElephant - a very large plant-eating mammal with a long trunk', 1, skin1Id]
      );
    } else {
      console.log('Animals diary page already exists, skipping creation.');
    }

    const [page5Check] = await pool.query(
      `SELECT id FROM diary_pages WHERE diary_id = ? AND page_number = ?`,
      [diary2Id, 2]
    );

    if (page5Check.length === 0) {
      await pool.query(
        `INSERT INTO diary_pages (diary_id, title, content, page_number, skin_id)
         VALUES (?, ?, ?, ?, ?)`,
        [diary2Id, 'Food', 'Apple - a round fruit with red, yellow, or green skin\nBread - a staple food made from flour and water\nCheese - a food made from the pressed curds of milk', 2, skin1Id]
      );
    } else {
      console.log('Food diary page already exists, skipping creation.');
    }

    const [page6Check] = await pool.query(
      `SELECT id FROM diary_pages WHERE diary_id = ? AND page_number = ?`,
      [diary3Id, 1]
    );

    if (page6Check.length === 0) {
      await pool.query(
        `INSERT INTO diary_pages (diary_id, title, content, page_number, skin_id)
         VALUES (?, ?, ?, ?, ?)`,
        [diary3Id, 'Teaching Methods', 'I\'ve found that using visual aids and real-life examples helps students grasp concepts more quickly. Interactive activities also keep them engaged and make learning more enjoyable.', 1, skin2Id]
      );
    } else {
      console.log('Teaching Methods diary page already exists, skipping creation.');
    }

    // Insert awards
    console.log('Inserting awards...');
    const [award1Result] = await pool.query(
      `INSERT INTO awards (name, description, image_url, points)
       VALUES (?, ?, ?, ?)`,
      ['Vocabulary Master', 'Awarded for learning 100 new words', '/uploads/images/vocabulary-master.png', 50]
    );
    const award1Id = award1Result.insertId;

    const [award2Result] = await pool.query(
      `INSERT INTO awards (name, description, image_url, points)
       VALUES (?, ?, ?, ?)`,
      ['Grammar Guru', 'Awarded for mastering advanced grammar concepts', '/uploads/images/grammar-guru.png', 75]
    );
    const award2Id = award2Result.insertId;

    const [award3Result] = await pool.query(
      `INSERT INTO awards (name, description, image_url, points)
       VALUES (?, ?, ?, ?)`,
      ['Conversation Champion', 'Awarded for excellent speaking skills', '/uploads/images/conversation-champion.png', 100]
    );
    const award3Id = award3Result.insertId;

    // Assign awards to users
    console.log('Assigning awards to users...');
    await pool.query(
      `INSERT INTO user_awards (user_id, award_id, awarded_by)
       VALUES (?, ?, ?)`,
      [studentId, award1Id, tutorId]
    );

    await pool.query(
      `INSERT INTO user_awards (user_id, award_id, awarded_by)
       VALUES (?, ?, ?)`,
      [studentId, award2Id, tutorId]
    );

    // Insert forums
    console.log('Inserting forums...');
    const [forum1Result] = await pool.query(
      `INSERT INTO forums (name, description, created_by)
       VALUES (?, ?, ?)`,
      ['General Discussion', 'A place to discuss anything related to English learning', adminId]
    );
    const forum1Id = forum1Result.insertId;

    const [forum2Result] = await pool.query(
      `INSERT INTO forums (name, description, created_by)
       VALUES (?, ?, ?)`,
      ['Grammar Help', 'Get help with English grammar', adminId]
    );
    const forum2Id = forum2Result.insertId;

    // Insert forum topics
    console.log('Inserting forum topics...');
    const [topic1Result] = await pool.query(
      `INSERT INTO forum_topics (forum_id, title, content, created_by, is_pinned)
       VALUES (?, ?, ?, ?, ?)`,
      [forum1Id, 'Welcome to the Forum!', 'Welcome to our English learning community! Feel free to introduce yourself and share your learning goals.', adminId, true]
    );
    const topic1Id = topic1Result.insertId;

    const [topic2Result] = await pool.query(
      `INSERT INTO forum_topics (forum_id, title, content, created_by)
       VALUES (?, ?, ?, ?)`,
      [forum2Id, 'Present Perfect vs. Simple Past', 'I\'m confused about when to use the present perfect tense versus the simple past tense. Can someone explain the difference with examples?', studentId]
    );
    const topic2Id = topic2Result.insertId;

    // Insert forum posts
    console.log('Inserting forum posts...');
    await pool.query(
      `INSERT INTO forum_posts (topic_id, content, created_by)
       VALUES (?, ?, ?)`,
      [topic1Id, 'Hi everyone! I\'m Jane, and I\'m learning English to prepare for my studies abroad. Looking forward to learning with all of you!', studentId]
    );

    await pool.query(
      `INSERT INTO forum_posts (topic_id, content, created_by)
       VALUES (?, ?, ?)`,
      [topic2Id, 'Great question! The present perfect is used for actions that started in the past and continue to the present or have a connection to the present. For example: "I have lived in London for five years" (and I still live there). The simple past is used for completed actions in the past. For example: "I lived in London for five years" (but I don\'t live there anymore).', tutorId]
    );

    // Insert chats
    console.log('Inserting chats...');
    const [chat1Result] = await pool.query(
      `INSERT INTO chats (name, is_group, created_by)
       VALUES (?, ?, ?)`,
      [null, false, studentId]
    );
    const chat1Id = chat1Result.insertId;

    const [chat2Result] = await pool.query(
      `INSERT INTO chats (name, is_group, created_by)
       VALUES (?, ?, ?)`,
      ['Study Group', true, tutorId]
    );
    const chat2Id = chat2Result.insertId;

    // Insert chat participants
    console.log('Inserting chat participants...');
    await pool.query(
      `INSERT INTO chat_participants (chat_id, user_id)
       VALUES (?, ?)`,
      [chat1Id, studentId]
    );

    await pool.query(
      `INSERT INTO chat_participants (chat_id, user_id)
       VALUES (?, ?)`,
      [chat1Id, tutorId]
    );

    await pool.query(
      `INSERT INTO chat_participants (chat_id, user_id)
       VALUES (?, ?)`,
      [chat2Id, tutorId]
    );

    await pool.query(
      `INSERT INTO chat_participants (chat_id, user_id)
       VALUES (?, ?)`,
      [chat2Id, studentId]
    );

    await pool.query(
      `INSERT INTO chat_participants (chat_id, user_id)
       VALUES (?, ?)`,
      [chat2Id, adminId]
    );

    // Insert messages
    console.log('Inserting messages...');
    await pool.query(
      `INSERT INTO messages (chat_id, sender_id, content)
       VALUES (?, ?, ?)`,
      [chat1Id, studentId, 'Hello! I have a question about my homework.']
    );

    await pool.query(
      `INSERT INTO messages (chat_id, sender_id, content)
       VALUES (?, ?, ?)`,
      [chat1Id, tutorId, 'Hi Jane! What can I help you with?']
    );

    await pool.query(
      `INSERT INTO messages (chat_id, sender_id, content)
       VALUES (?, ?, ?)`,
      [chat2Id, tutorId, 'Welcome to our study group! We\'ll use this chat to coordinate our group sessions.']
    );

    await pool.query(
      `INSERT INTO messages (chat_id, sender_id, content)
       VALUES (?, ?, ?)`,
      [chat2Id, studentId, 'Thanks for adding me to the group!']
    );

    await pool.query(
      `INSERT INTO messages (chat_id, sender_id, content)
       VALUES (?, ?, ?)`,
      [chat2Id, adminId, 'Let me know if you need any resources for your study sessions.']
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
