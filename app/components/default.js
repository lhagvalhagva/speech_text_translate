const defaultText = `
[What's your name?]
    {Hello, my name is Name. I chose this name because my parents were inspired by its meaning which represents meaning}


[Can you introduce yourself and your family?]
    {I am age years old and I'm a student at university name. I live with my family - my father works as profession, my mother is a profession, and I have number siblings. We are a close family because we always support each other}


[Can you tell me why you would like to come on Work and Travel program?]
    {I would like to come on the Work and Travel program because it's a great opportunity to improve my English skills, experience a new culture, and meet people from around the world. This experience will help me grow both personally and professionally}


[Why did you decide to participate in Work and Travel program?]
    {I decided to participate in the Work and Travel program because I want to gain international work experience, which will be valuable in my future career. Additionally, I am excited to explore American culture and improve my language skills in a real-world setting}


[Do you have any hobbies?]
    {Yes, I enjoy hobby and another hobby because these activities help me relax and develop new skills. I spend about number hours per week on my hobbies, and I've been doing them for number years}


[What do you do?]
    {I am a student studying major at university name university. I also work part-time as job because I want to gain practical experience while studying}


[What major do you study?]
    {I study major because this field combines my interest in specific interest with good career opportunities. I am currently in my 1st/2nd/3rd/4th year}


[Why did you choose this major?]
    {I chose this major because I have always been interested in computer science. Also, this field has good job prospects in Mongolia, and I can use these skills to develop innovative software solutions for local businesses}


[Is this a popular major in your country?]
    {Yes, this major is highly sought after. Currently, about 2000 students study this field in Mongolia because of the growing IT sector. The demand for this profession is increasing rapidly}


[Do you have any other person in this major in your family?]
    {Yes. My older sister studied this major because she was inspired by the tech industry's growth}


[How many more years do you have left to finish your school?]
    {I have 1 year left to finish my degree. I will graduate in June 2026 because our program is 4 years long}


[What university do you go to?]
    {I study at National University of Mongolia. I chose this university because it has a strong program in computer engineering and excellent facilities for practical programming training}


[What course are you?]
    {I am in my 3rd year. This year is important because we are studying software engineering and learning about algorithms}


[Is there any particular place you would like to visit in the US?]
    {Yes, I would really like to visit New York because of its vibrant culture. I am interested in seeing the Statue of Liberty and experiencing the city's nightlife}


[Why?]
    {Because this place represents the American dream and offers unique opportunities to meet diverse people. Also, I have always been fascinated by the history of the city}


[Will you travel in the US?]
    {Yes, I plan to travel during my free time and after completing my work commitment. I want to visit California because of its beautiful beaches, and I have saved $500 for travel expenses}


[What part of Mongolian culture do you hope to share with Americans?]
    {I want to share our traditional dance, our unique cuisine, and teach them about our nomadic lifestyle. These aspects of our culture are important because they show our connection to nature}


[What kind of movies do you like to watch? Do you watch TV series?]
    {I enjoy watching action movies because they are exciting. Yes, I watch TV series, particularly dramas because they tell deep stories}


[What kind of music do you like to listen to?]
    {I prefer pop music because it lifts my mood. My favorite artists are Taylor Swift and Ed Sheeran because their music is relatable and meaningful}


[What do you do with your friends in your free time?]
    {With my friends, I usually hang out at cafes. We enjoy these activities because they help us relax and catch up. We meet about twice per month}


[How much do you know about America?]
    {I know about American history, geography, and culture. I learned this through classes and documentaries. I'm especially interested in its diverse cultures}


[Have you learned anything about American culture from movies or through your classes?]
    {Yes, I've learned about American values from movies and social norms from my classes. These taught me that American culture values freedom and individualism}


[What kind of sports do you like?]
    {I like basketball because it is fast-paced and fun. This sport teaches me teamwork and helps me stay fit}


[Do you play any sports?]
    {Yes, I play basketball. I've been playing for five years because I enjoy the competition. I practice three times per week}


[Do you play in a team or do you just play for fun?]
    {I play in a team because it builds camaraderie. This helps me develop leadership skills and discipline}


[Do you have any job experience?]
    {Yes, I worked as a barista for two years. I gained experience in customer service and learned how to handle different situations}


[What was your duty there?]
    {My main responsibilities included task, task, and task. I was in charge of responsibility because reason}


[How did you like working there?]
    {I enjoyed working there because reason. The experience taught me skill and helped me develop ability}


[Do you like living in Mongolia?]
    {Yes, I like living in Mongolia because of our aspect culture, aspect community, and feature. However, I want to experience living in America to goal}


[What is your favorite actor/actress/singer/band?]
    {My favorite is name because their quality inspires me. I especially like their work because reason}


[What would you do when you go back to Mongolia?]
    {When I return, I plan to plan and plan. This experience will help me goal because reason}


[What things do you want to do in the US?]
    {In the US, I want to activity, learn about aspect, and experience experience. These activities will help me benefit}


[What is your GPA?]
    {My GPA is number. I maintain this by method and method. I study number hours daily}


[Have you ever been to any other countries before?]
    {Yes/No. I have visited country name(s) because reason. The experience taught me lesson and lesson}


[How did you like it?]
    {I enjoyed it because it was fun. The most impressive thing was the scenery and I learned a lot about the culture}


[What part of the US would you like to go to during the WAT program?]
    {I would like to go to California because of the beautiful weather. This location offers opportunities for networking and experiencing diverse cultures}


[What is your favorite subject at school?]
    {My favorite subject is science because I love learning about the world. I find it interesting when we study biology and chemistry}


[nAfter you graduate from university, what would you do? Where would you work?]
    {After graduation, I plan to pursue a career in technology and work as a software developer. I chose this path because I enjoy coding and the tech industry is growing}


[Do you have any talent?]
    {Yes, I am good at playing the guitar and singing. I developed these talents through music lessons and practice them by performing at local events}


[What is your strength?]
    {My main strengths are communication and problem-solving. These help me in team projects because I can effectively share ideas}


[What is your weakness?]
    {My weakness is time management. I am working to improve this by setting clear goals because I want to be more organized}


[What do you think is the key to success?]
    {I believe the key to success is hard work and determination. These are important because they drive you to achieve your goals}


[How long have you been studying English?]
    {I have been studying English for three years. I practice by reading books and watching movies}


[What is your future plan?]
    {My future plans include traveling the world and continuing my education. I chose these goals because I want to experience new cultures}


[What is the main purpose that you are going to the US?]
    {My main purpose is to gain international experience, gain experience in my field, and improve my English. These will help me advance my career}


[Do you have any siblings?]
    {Yes, I have one older sister. We are close because we share many interests}


[Have you ever been outside of your country?]
    {Yes, I visited Japan for two weeks. The experience was valuable because I learned about their culture and traditions}


[Have you ever traveled through your country?]
    {Yes, I have visited several regions of Mongolia because I wanted to see the natural beauty. I learned about the history of each place}


[What is the most memorable moment in your life?]
    {My most memorable moment was when I graduated from high school. It's important to me because it marked a new beginning}


[Are you able to be at your employer by June 1st?]
    {Yes, I can be there by June 1st because I have arranged my travel plans. My schedule allows me to be flexible}


[What kind of job can you do?]
    {I can work as a customer service representative because I have experience in customer service and I enjoy working with people}


[What kind of job would you like to do?]
    {I would like to work as a marketing specialist because it matches my skills in communication and I want to gain more experience in this field}


[What makes you think you can do this job?]
    {I believe I can do this job because I have studied business management for four years and I have good organizational skills}


[Why do you think you are suitable for this position?]
    {I am suitable for this position because I am hardworking and organized, and I have experience in customer service}


[If you don't get the job you wanted, would you still continue the program?]
    {Yes, I would continue because this program is a valuable opportunity to gain international experience and improve my English skills}


[What part of the US would you like to go to on the WAT program?]
    {I would like to go to California because I am interested in its beaches and there are many job opportunities there}


[What is the first thing you will do when you arrive in the US?]
    {First, I will check in with my program coordinator and get settled in my accommodation because it's important to have a secure base before starting work}


[What is your ideal salary?]
    {My expected salary would be minimum wage because it would cover my living expenses and allow me to save some money}


[When does your school end?]
    {My school typically ends in late May or early June. This is because the academic year in Mongolia usually follows a similar schedule to many other countries}


[Can you swim?]
    {Yes, I can swim. I learned it when I was young because my parents encouraged me to learn water safety skills}


[Do you play any musical instrument?]
    {No, I don't play any musical instrument. Unfortunately, I haven't had the opportunity to learn one}



[Is there any particular city or a place you would like to visit in the US?]    
      {I'd love to visit New York City. This is because it's a cultural hub with diverse people and exciting opportunities}


[What is your favorite holiday?]
{My favorite holiday is Tsagaan Sar, the Mongolian New Year. This is because it's a time for family, tradition, and delicious food}
    

[Can you describe Mongolia?]
{Mongolia is a landlocked country with vast grasslands and stunning mountains. It's known for its nomadic culture and beautiful nature. This unique landscape has shaped the way of life for Mongolians for centuries}
    

[What part of Mongolia do you live in?]
{I live in Ulaanbaatar, the capital city of Mongolia}
    

[Who do you live with?]
{I live with my family, which includes my parents and siblings}
    

[What are the things you want to do in the US?]
{I want to experience American culture, improve my English language skills, and work part-time to gain work experience}
    

[Do you know anybody in the US?]
{No, I don't know anyone personally in the US}
    

[What is your intended date of arrival in the US?]
{I plan to arrive in the US on Your intended date of arrival}
    

[Do you have any health conditions?]
{No, I don't have any serious health conditions}
    

[Are you allergic to anything?]
{No, I'm not allergic to anything}
    

[Do you have any relatives in the US?]
{No, I don't have any relatives living in the US}
    

[What do you think about the Work and Travel program?]
{I think the Work and Travel program is a great opportunity to experience American culture, improve my English, and gain valuable work experience}
    

[Who will pay for your travel expenses?]
{I will be paying for my own travel expenses}
    

[What's your phone number?]
{My phone number is Your phone number}
    

[How many siblings do you have?]
{I have Number siblings}
    

[What's your favorite color?]
{My favorite color is Your favorite color}
    

[Do you like working in a group or individually?]
{I prefer working individually, as it allows me to focus better and work at my own pace. However, I can also work effectively in a group}
    

[What is your short and long-term goal?]
{My short-term goal is to successfully complete my studies and gain valuable work experience through the Work and Travel program. My long-term goal is to pursue a career in Your desired field and contribute to the development of my country}
    

[What kind of cultural difficulties do you expect if you go to the USA?]
{I expect to encounter language barriers and cultural differences, such as different customs and social norms. However, I'm open to learning and adapting to new experiences}
    

[What do you think is the biggest difference between Mongolia and the USA?]
{One of the biggest differences between Mongolia and the US is the pace of life. The US tends to be faster-paced, while Mongolia has a more relaxed lifestyle}
    

[Who is the closest person to you in your family?]
{My closest person in my family is my Relationship, e.g., mother, father, sibling. We share a strong bond and often confide in each other}
    

[What is your parents' occupation?]
{My father works as a Father's occupation, and my mother works as a Mother's occupation}
    

[What do you like to do in your free time?]
{In my free time, I enjoy Your hobbies, e.g., reading, watching movies, playing sports}
    

[How do you usually spend your free time?]
{I usually spend my free time Your activities, e.g., studying, hanging out with friends, playing video games}
    

[What will you do in your free time in the United States?]
{In my free time in the US, I plan to explore new places, try different activities, and make new friends}
    

[How do you feel about going to the USA?]
{I'm excited and nervous about going to the US. I'm looking forward to experiencing new things and challenging myself}
    

[How will you spend Independence Day?]
{If I'm in the US on Independence Day, I'd love to attend a fireworks display or a parade}
    

[What genre of movie do you like?]
{I enjoy watching Genre, e.g., action, comedy, drama movies}
    

[Who is your best friend? Can you tell me about her/him?]
{My best friend is Friend's name. We've been friends since How long. She/He is Positive qualities, e.g., kind, funny, intelligent}
    

[What is the Mongolian currency?]
{The Mongolian currency is the Tögrög}
    

[What can you buy with 1 dollar in Mongolia?]
{With 1 dollar, you can buy a small snack or a few basic items in Mongolia}
    

[If you had a million dollars, how would you spend it? What would you do?]
{If I had a million dollars, I would invest in my education, travel the world, and help those in need}
    

[Do you ever think about studying abroad?]
{Yes, I've thought about studying abroad to gain new experiences and broaden my horizons}
    

[Will you do a second job in the US during the WAT program?]
{I'm open to the possibility of a second job if my schedule allows}
    

[Are you participating in this program alone or with your friends?]
{I'm participating in this program alone}
    

[How well do you get along with your siblings?]
{I get along well with my siblings. We often spend time together and support each other}
    

[What lessons are you studying?]
{I'm currently studying List of subjects, e.g., English, Mathematics, History}
    

[What have you been doing today?]
{Today, I've been Your activities, e.g., studying, working, spending time with family}
    

[How was your day today?]
{My day was Positive or negative adjective, e.g., good, bad, tiring. I Describe your day, e.g., studied for an exam, went for a walk}
    

[What time is it?]
{It's Current time}
    

[What are you studying at the university?]
{I'm studying Your major at University name}
    

[How many years have you been studying Your major?]
{I've been studying Your major for Number years}
    

[Do you have any volunteer experience?]
{Yes, I've volunteered at Organization to Reason, e.g., help the community, gain experience}
    

[Do you watch American movies?]
{Yes, I enjoy watching American movies, especially Genre, e.g., action, comedy, drama}
    

[What are you going to do this weekend?]
{This weekend, I plan to Your plans, e.g., study, hang out with friends, go on a trip}
    

[If I were to come to visit, what should I see?]
{If you visit Mongolia, you should definitely see Place 1, Place 2. These places offer beautiful scenery and unique cultural experiences}
    

[What language are your classes in?]
{My classes are in Mongolian}
    

[What kind of people/customers came to your work?]
{As a Your occupation, I typically interact with Type of people, e.g., students, colleagues, clients}
    

[What do you do when you are not busy?]
{When I'm not busy, I usually Your activities, e.g., read books, watch movies, spend time with family and friends}
    

[Have you had a chance to travel before?]
{Yes, I've traveled to Places you've visited, e.g., other provinces in Mongolia, neighboring countries}
    

[What will you do after our interview?]
{After the interview, I'll probably Your plans, e.g., study, relax, go out with friends}
    

[Do you have exams this week?]
{Yes, I have an exam in Subject on Date}
    

[Is it the end-semester exam or midterm exam?]
{It's a End-semester/midterm exam}
    

[Can you tell me about your country?]
{Mongolia is a landlocked country in East Asia. It's known for its vast grasslands, nomadic culture, and stunning natural beauty}
    

[Can you tell me about your hometown?]
{I'm from Your hometown. It's a Size and description of your hometown, e.g., small town, big city, historical, modern}
    

[Can you cook?]
{Yes, I can cook Dishes you can cook, e.g., Mongolian food, international cuisine}
    

[How do you cook it?]
{To cook Dish name, I Steps involved in cooking}
    `;

export default defaultText;
