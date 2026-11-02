// Usage: SEED_PASSWORD='Str0ng!Pass' npm run seed   (reads MONGO_URL from the root .env)
// Safe to re-run: exits if the super admin already exists.
require('dotenv').config({ path: require('path').resolve(__dirname, '../../../.env') })
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const m = require('./models')
const M = (p) => require(p)
const ProgramAdmin = M('./models/programAdmin')
const NeedCategory = M('./models/needOrCategory')
const Pathway = M('./models/pathways')
const ResourceCategory = M('./models/rsoruceCastgeory')
const Resource = M('./models/resourceGiven')
const Request = m.request
const Notes = M('./models/notes')
const Notification = M('./models/notification/notification.model')
const RequestHistory = M('./models/requestHistory')
const ActionPathway = M('./models/actionStepPathway')
const AuditLog = M('./models/auditLogs')
const ReminderFlag = M('./models/todoReminder/todoReminder.model')

const MAIN = 'vansh.webvoltz@gmail.com'
const alias = (n) => MAIN.replace('@', `+${n}@`)
const day = 864e5
const at = (d) => new Date(Date.now() + d * day)
const pick = (a, i) => a[i % a.length]

const run = async () => {
  const password = process.env.SEED_PASSWORD
  if (!password || !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password)) {
    throw new Error('Set SEED_PASSWORD (8+ chars, upper, lower, digit, symbol)')
  }
  await mongoose.connect(process.env.MONGO_URL)
  if (await m.user.findOne({ email: MAIN })) return console.log('Already seeded, nothing to do.')
  const hash = await bcrypt.hash(password, 10)

  // ---- accounts: main super admin, +1 program admin, +2 CHW, +3 client (all deliver to the same Gmail inbox)
  const base = { password: hash, is_Verified: true, is_set_pwd: true, is_pa_pwd_set: true, isActive: true }
  const [admin, pa, chw, client0] = await m.user.create([
    { ...base, firstName: 'Vansh', lastName: 'Admin', email: MAIN, userName: 'VanshAdmin@1', role: 'Super_Admin', Phone: '5550000000', city: 'Austin', zipCode: '73301' },
    { ...base, firstName: 'Priya', lastName: 'Program', email: alias(1), userName: 'PriyaPA@1', role: 'Program_Administrator', Phone: '5550000001', city: 'Austin', zipCode: '73301', pa_program: ['Maternal Health', 'Housing Support'] },
    { ...base, firstName: 'Carlos', lastName: 'Worker', email: alias(2), userName: 'CarlosCHW@1', role: 'CHW', Phone: '5550000002', city: 'Austin', zipCode: '73301' },
    { ...base, firstName: 'Cleo', lastName: 'Client', email: alias(3), userName: 'CleoClient@1', role: 'Client', Phone: '5550000003', city: 'Austin', zipCode: '73301', status: 'Open', program: 'Maternal Health', memberGroup: 'Adult' },
  ])
  await m.user.updateOne({ _id: pa._id }, { pa_id: admin._id, createdBy: admin._id })
  await m.user.updateOne({ _id: chw._id }, { pa_id: pa._id, createdBy: admin._id })

  // more CHWs and PAs on example.com (cannot receive mail; fine for data)
  const extra = await m.user.create([
    { ...base, firstName: 'Dana', lastName: 'Lee', email: 'dana.lee@example.com', userName: 'DanaPA@1', role: 'Program_Administrator', Phone: '5550001001', pa_program: ['Food Security'], pa_id: admin._id, createdBy: admin._id },
    { ...base, firstName: 'Mei', lastName: 'Tan', email: 'mei.tan@example.com', userName: 'MeiCHW@1', role: 'CHW', Phone: '5550001002', pa_id: pa._id, createdBy: admin._id },
    { ...base, firstName: 'Omar', lastName: 'Reed', email: 'omar.reed@example.com', userName: 'OmarCHW@1', role: 'CHW', Phone: '5550001003', pa_id: pa._id, createdBy: admin._id },
  ])
  const chws = [chw, extra[1], extra[2]]

  const names = [['Ana', 'Lopez'], ['Ben', 'Carter'], ['Chloe', 'Nguyen'], ['Dev', 'Patel'], ['Eli', 'Brooks'], ['Fay', 'Khan'], ['Gus', 'Moreno'], ['Hana', 'Ito']]
  const statuses = ['Pending', 'Open', 'Open', 'Closed-Success', 'Closed-Inactive', 'Open', 'Pending', 'Open']
  const clients = [client0, ...(await m.user.create(names.map(([f, l], i) => ({
    ...base, firstName: f, lastName: l, email: `${f}.${l}@example.com`.toLowerCase(), userName: `${f}${l}@1`, role: 'Client',
    Phone: `55550020${10 + i}`, city: 'Austin', zipCode: `7330${i}`, address: `${100 + i} Main St`, status: statuses[i],
    program: pick(['Maternal Health', 'Housing Support', 'Food Security'], i), memberGroup: pick(['Adult', 'Youth', 'Senior'], i),
    birthDate: `19${70 + i}-0${1 + (i % 9)}-15`, assign_to: pick(chws, i)._id, isChw_Assign: true, createdBy: admin._id,
    client_goal: pick(['Stable housing', 'Regular prenatal care', 'Reliable food access'], i), createdDate: new Date().toISOString(),
  }))))]
  await m.user.updateOne({ _id: client0._id }, { assign_to: chw._id, isChw_Assign: true, createdBy: admin._id })
  await ProgramAdmin.create([
    { firstName: 'Priya', lastName: 'Program', email: alias(1), phone: '5550000001', zipcode: '73301', program: ['Maternal Health', 'Housing Support'], password: hash, is_set_pwd: true },
    { firstName: 'Dana', lastName: 'Lee', email: 'dana.lee@example.com', phone: '5550001001', zipcode: '73301', program: ['Food Security'], password: hash, is_set_pwd: true },
  ])

  // ---- needs, pathways, resources
  const needs = await NeedCategory.create(['Housing', 'Food', 'Healthcare', 'Transportation', 'Employment'].map((name) => ({ name })))
  const pathways = await Pathway.create(needs.flatMap((n) => [
    { name: `${n.name} Assessment`, need: n._id, description: [`Assess ${n.name.toLowerCase()} needs`, 'Document barriers'] },
    { name: `${n.name} Referral`, need: n._id, description: [`Refer to a ${n.name.toLowerCase()} provider`, 'Follow up in 7 days'] },
  ]))
  const rcats = await ResourceCategory.create(['Shelter', 'Food Bank', 'Clinic', 'Transit', 'Job Training'].map((resource_category) => ({ resource_category, createdBy: admin._id })))
  const resources = await Resource.create(rcats.map((c, i) => ({
    resource_name: `${c.resource_category} Services ${i + 1}`, organization: `Austin ${c.resource_category} Org`, resource_details: `Provides ${c.resource_category.toLowerCase()} support.`,
    website: `https://example.org/${i}`, email: `help${i}@example.org`, phone: `5550300${i}`, category: c._id, eligibility: 'Residents of Travis County',
    attachments: { name: 'Brochure', files: [] }, createdBy: admin._id,
  })))

  // ---- question banks
  const qcats = await m.questionCategory.create(['Housing', 'Health', 'Food'].map((category) => ({ category, created_by: admin._id })))
  const questions = await m.questions.create([
    { question: 'Do you currently have stable housing?', category: 'Housing', answer_type: 'radio', ansOptions: ['Yes', 'No'], createBy: admin._id },
    { question: 'Do you have a primary care provider?', category: 'Health', answer_type: 'radio', ansOptions: ['Yes', 'No'], createBy: admin._id },
    { question: 'How many meals did you skip last week?', category: 'Food', answer_type: 'text', ansOptions: [], createBy: admin._id },
  ])
  const ql = (q) => [{ key: 'en', value: q }]
  const pqs = await M('./models/profileQuestion').create([
    { createdBy: admin._id, category: 'Demographics', question: 'Preferred language', questionML: ql('Preferred language'), answers: { answer_type: 'radio', answersML: { en: ['English', 'Spanish', 'Other'] } }, seq: 1, sequence: 1, questionNumber: 1 },
    { createdBy: admin._id, category: 'Demographics', question: 'Household size', questionML: ql('Household size'), answers: { answer_type: 'text', answersML: {} }, seq: 2, sequence: 2, questionNumber: 2 },
    { createdBy: admin._id, category: 'Health', question: 'Do you have health insurance?', questionML: ql('Do you have health insurance?'), answers: { answer_type: 'radio', answersML: { en: ['Yes', 'No'] } }, seq: 3, sequence: 3, questionNumber: 3 },
  ])
  await m.questionnaireModel.create(pqs.map((q) => ({ createdBy: admin._id, category: q.category, question: q.question, questionML: q.questionML, answers: q.answers, short_desc: ql(q.question) })))
  for (const c of clients.slice(0, 5)) {
    await m.user.updateOne({ _id: c._id }, { profileQuestion: [{ question: pqs[0]._id, answer: [{ key: 'en', answer: 'English' }] }, { question: pqs[1]._id, answer: [{ key: 'en', answer: '3' }] }] })
  }
  await m.profileQuestionHistory.create(clients.slice(0, 3).map((c) => ({ clientId: c._id, submittedBy: chw._id, modifiedBy: chw._id, profileQuestion: [{ question: pqs[0]._id, answer: [{ key: 'en', answer: 'English' }] }] })))

  // ---- per-client activity
  const reqStatus = ['Submitted', 'In-Progress', 'Completed', 'In-Progress', 'Submitted', 'Completed']
  for (const [i, c] of clients.entries()) {
    const owner = pick(chws, i)
    const need = pick(needs, i), pathway = pick(pathways.filter((p) => String(p.need) === String(need._id)), i)
    const visit = await m.visit.create({
      visitType: pick(['Home Visit', 'Phone Call', 'Clinic'], i), lengthOfvisit: 30 + i * 5, lengthOfvisitUnit: 'minutes', clientStory: 'Client reports ongoing difficulty accessing services.',
      primaryNeed: [need._id], pathway: [pathway._id], nextSteps: 'Connect with referred resource', visitDate: at(-i - 1), followupDate: at(i + 3), followupReason: 'Check referral progress',
      createdBy: owner._id, clientId: c._id, assign_to: owner._id, createdDate: new Date().toISOString(),
    })
    await m.visitHistory.create({ clientId: c._id, visitId: visit._id, visitType: visit.visitType, visitDate: String(visit.visitDate), lengthOfVisit: '30 minutes', clientStory: visit.clientStory, clientGoal: c.client_goal, primaryNeed: [need._id], pathway: [pathway._id], createdBy: owner._id, modifiedBy: owner._id })
    const status = pick(reqStatus, i)
    const req = await Request.create({
      createdby: owner._id, pathway: pathway._id, request_by: c._id, assign_to: owner._id, assigned_chw: owner._id, visitId: visit._id, request_details: `Needs help with ${need.name.toLowerCase()}`,
      request_status: status, request_type: need._id, resources_given: [pick(resources, i)._id], urgent: i % 4 === 0, is_task_assing: true,
    })
    await RequestHistory.create({ currentStatus: 'Submitted', newStatus: status, reason: 'Initial triage', requestId: req._id, clientId: c._id, modifiedBy: owner._id })
    await m.activityRequest.create({ userId: owner._id, requestId: req._id, status, other: { note: 'seeded' } })
    await m.actionStepHistoryModel.create({ request_by: c._id, assign_to: owner._id, requestId: req._id, request_details: req.request_details, request_status: status, request_type: need._id, pathway: pathway._id, resources_given: req.resources_given, reason: 'Created', createdBy: owner._id, modifiedBy: owner._id })
    await ActionPathway.create({ pathwayId: pathway._id, userId: c._id, status, requestId: [req._id], outcomes: status === 'Completed' ? ['Resolved'] : [] })
    const task = await m.taskClient.create({ clientId: c._id, createdby: owner._id, assign_to: owner._id, visitId: visit._id, task: { category: [need._id], task_name: `Follow up: ${need.name}`, task_description: 'Call client and confirm referral outcome', status: pick(['Pending', 'In-Progress', 'Completed'], i) }, dueDate: at(i + 2) })
    await m.taskClientHistoryModel.create({ currentStatus: 'Pending', newStatus: task.task.status, statusReason: 'Progress update', currentDueDate: String(task.dueDate), newDueDate: String(task.dueDate), taskClientId: task._id, clientId: c._id, modifiedBy: owner._id })
    await m.questionClient.create({ clientId: c._id, paid: pa._id, chwid: owner._id, requestId: req._id, category: pick(questions, i).category, answer: 'Yes', question: { questionId: pick(questions, i)._id, question: pick(questions, i).question, category: pick(questions, i).category, answer: 'Yes', ansOptions: ['Yes', 'No'], answer_type: 'radio' } })
    await m.questionObjective.create({ clientId: c._id, label: 'Goal', fromValue: '', value: c.client_goal, createdBy: owner._id, modifiedBy: owner._id })
    await m.clientGoalHistoryModel.create({ visitId: visit._id, clientId: c._id, from_client_goal: 'None', to_client_goal: c.client_goal, modifiedBy: owner._id })
    await m.clientStatusHistoryModel.create({ clientId: c._id, oldStatus: 'Pending', newstatus: c.status, statusReason: 'Intake complete', modifiedBy: owner._id })
    await Notes.create({ clientId: c._id, contactType: pick(['Phone', 'Email', 'Text'], i), status: i % 2 ? 'Answered' : 'Not-Answered', description: 'Attempted contact regarding referral.', createdBy: owner._id })
    await m.resourceGivenModel.create({ resource_name: `Custom referral ${i + 1}`, organization: 'Community Partner', resource_details: 'One-off referral', category: pick(rcats, i)._id, createdBy: owner._id })
    await m.attachementModel.create({ clientId: c._id, name: 'Consent form', files: [] })
    await m.reminders.create({ reminder_by: owner._id, is24Hours: 'true', is12Hours: 'false', is30Minutes: 'true' })
  }

  // ---- todos, notifications, flags
  const todos = await m.todos.create(chws.concat([pa, admin]).flatMap((u, i) => [
    { assign_to: u._id, createdBy: admin._id, category: 'Admin', task_name: `Weekly review ${i + 1}`, task_description: 'Review open requests', status: 'Pending', dueDate: at(2 + i) },
    { assign_to: u._id, createdBy: admin._id, category: 'Outreach', task_name: `Community outreach ${i + 1}`, task_description: 'Visit partner organization', status: 'In-Progress', dueDate: at(5 + i) },
  ]))
  await m.sendTodos.create(todos.slice(0, 4).map((t) => ({ assign_to: t.assign_to, createBy: admin._id, todoId: t._id, is24hours: 'false', is12hours: 'false', is30Minutes: 'false' })))
  const notifs = await Notification.create([{ createdBy: admin._id, reminders: [{ time: 1, unit: 'days', direction: 'before' }, { time: 30, unit: 'minutes', direction: 'before' }] }])
  await ReminderFlag.create(todos.slice(0, 3).map((t) => ({ todoId: t._id, reminderId: notifs[0]._id, sent: false })))

  // ---- templates, appearance, contact, audit
  await m.emailTemplate.create([
    { name: 'welcome', subjectTemplate: 'Welcome to CareBridge', bodyTemplate: 'Hi {{name}}, welcome to CareBridge.', craetedBy: admin._id },
    { name: 'visit_reminder', subjectTemplate: 'Upcoming visit', bodyTemplate: 'Hi {{name}}, you have a visit on {{date}}.', craetedBy: admin._id },
    { name: 'follow_up', subjectTemplate: 'Following up', bodyTemplate: 'Hi {{name}}, checking in on your referral.', craetedBy: admin._id },
  ])
  await m.apperance.create({ createdBy: admin._id })
  await m.contactUs.create([
    { fullName: 'Jamie Visitor', email: 'jamie@example.com', message: 'How do I enroll?', description: [] },
    { fullName: 'Sam Partner', email: 'sam@example.org', message: 'We would like to list our food bank.', description: [] },
  ])
  await AuditLog.create([admin, pa, chw].map((u) => ({ route: '/user/login', method: 'POST', accessedBy: u._id, accessedRole: u.role, accessedData: { seeded: true } })))

  console.log(`Seeded. Logins (all use SEED_PASSWORD, OTP goes to Gmail inbox):\n  ${MAIN} Super_Admin\n  ${alias(1)} Program_Administrator\n  ${alias(2)} CHW\n  ${alias(3)} Client`)
}

run().catch((e) => { console.error(e); process.exitCode = 1 }).finally(() => mongoose.disconnect())
