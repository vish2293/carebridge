const cron = require('node-cron');
const { user, todos, taskClient } = require('../../models');
const notificationModel = require('../../models/notification/notification.model');
const reminderFlagModel = require('../../models/todoReminder/todoReminder.model');
const { reminderTemplate } = require('../emailServices/template');
const { createTransporter } = require('../emailServices/transPorter');



const sendReminderEmail = async (assigneeEmail, task, direction, dueDate) => {
  let subjectPrefix;
  let textPrefix;

  if (direction === 'after') {
    subjectPrefix = 'Overdue Reminder';
    textPrefix = 'This is an overdue reminder for your task';
  } else {
    subjectPrefix = 'Reminder';
    textPrefix = 'This is a reminder for your upcoming task';
  }
  const template = reminderTemplate(task, assigneeEmail, dueDate)

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: assigneeEmail.email,
    subject: `${subjectPrefix} for Next steps of : ${task.task_name}`,
    html: template,
  };

  try {
    let transpoter = createTransporter;
    transpoter.sendMail(mailOptions);
    console.log("mail sent");
  } catch (error) {
    console.error(`Error sending reminder email for Todo: ${task_name}`, error);
  }
};

const handleDynamicReminders = async () => {
  try {
    const todosData = await taskClient.find();
    const notificationList = await notificationModel.find()

    for (const todo of todosData) {
      const dueDate = new Date(todo.dueDate);
      if (dueDate > new Date()) {
        notificationList.map(async (data) => {
          if (data.reminders && data.reminders.length > 0) {
            data.reminders.map(async (reminders) => {
              const { time, unit, direction, id } = reminders;

              let timeMultiplier;
              switch (unit) {
                case 'minutes':
                  timeMultiplier = 60000;
                  break;
                case 'hours':
                  timeMultiplier = 3600000;
                  break;
                case 'days':
                  timeMultiplier = 86400000;
                  break;
                case 'weeks':
                  timeMultiplier = 604800000;
                  break;
                default:
                  throw new Error('Invalid unit for reminder');
              }
              const adjustment = direction === 'before' ? -1 : 1;
              const cronDate = new Date(dueDate.getTime() + adjustment * time * timeMultiplier);
              const reminderFlag = await reminderFlagModel.findOne({
                todoId: todo._id,
                reminderId: id,
              });
              if (!reminderFlag || (reminderFlag && !reminderFlag.sent && new Date() >= cronDate)) {
                const assignee = await user.findById(todo.chwid);
                if (assignee) {
                  const assigneeEmail = assignee.email;
                  const currenetDate = new Date();
                  cronDate.setSeconds(0);
                  currenetDate.setSeconds(0);
                  currenetDate.setMilliseconds(0);
                  cronDate.setMilliseconds(0);
                  if (currenetDate.getTime() === cronDate.getTime()) {

                    await sendReminderEmail(assignee, todo?.task, direction, dueDate);

                    if (!reminderFlag) {
                      await reminderFlagModel.create({
                        todoId: todo._id,
                        reminderId: id,
                        sent: true,
                      });

                    } else {
                      reminderFlag.sent = true;
                      await reminderFlag.save();
                    }
                  }
                }
              }
              return { date: cronDate, reminderId: id };
            })
          }

          // Check if reminder has been sent


        });
      }
    }
  } catch (error) {
    console.error('Error handling dynamic reminders:', error);
  }
};

// Schedule the cron job
cron.schedule('*/1 * * * *', async () => {
  await handleDynamicReminders();
});

module.exports = {
  handleDynamicReminders,
};
