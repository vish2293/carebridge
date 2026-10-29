import React from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import Header from '../../components/common/Header'
import Footer from '../../components/common/Footer'
import { PATH_LIST } from '../../constant/path-list'
import "./style.scss"

const steps = [
    { t: 'Request received', d: 'A resident describes what they need, in their own words, by form or by phone.' },
    { t: 'Reviewed by the team', d: 'A coordinator checks the request, sets priority and adds missing details.' },
    { t: 'Worker assigned', d: 'The request goes to the Community Health Worker closest to the need.' },
    { t: 'Visit and follow-up', d: 'Visits, goals and reminders are tracked until the need is closed.' },
]

// a trailing * marks a visit in the second color
const visits = [
    ['9:00 Rivera', '2:00 Chen*'],
    ['11:00 Okafor'],
    ['10:00 Alvarez', '1:00 Reyes*', '3:30 Patel'],
    ['2:00 Alvarez*'],
    ['9:30 Chen'],
]
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']

const LandingPage = () => {
    const token = localStorage.getItem("token")
    const navigate = useNavigate()
    if (token) return <Navigate to={PATH_LIST.user.dashboard} />
    const request = () => navigate(PATH_LIST.onBoarding)

    return (
        <>
            <Header navigate={navigate} />
            <main className='lp'>
                <section className='lp_hero'>
                    <div className='lp_wrap lp_hero_grid'>
                        <div>
                            <h1>Help finds its way to the right door.</h1>
                            <p className='lp_lead'>CareBridge sends every request from your community to a Community Health Worker, books the visit, and keeps following up until the need is met.</p>
                            <div className='lp_actions'>
                                <button className='lp_btn lp_btn_gold' onClick={request}>Request support</button>
                                <a className='lp_btn lp_btn_ghost' href='#how'>See how it works</a>
                            </div>
                        </div>

                        <aside className='lp_mock' aria-label='Example request'>
                            <div className='lp_mock_top'>
                                <strong>Request #2481</strong>
                                <span className='lp_pill'>In progress</span>
                            </div>
                            <p className='lp_mock_title'>Help applying for housing assistance</p>
                            <ol className='lp_track'>
                                <li className='done'>Received<small>9:14 am</small></li>
                                <li className='done'>Reviewed<small>9:40 am</small></li>
                                <li className='now'>Assigned to Maria Alvarez<small>Community Health Worker</small></li>
                                <li>Home visit<small>Thursday, 2:00 pm</small></li>
                            </ol>
                            <div className='lp_mock_note'>
                                <b>Reminder sent</b> to the resident, 24 hours before the visit.
                            </div>
                        </aside>
                    </div>
                </section>

                <section className='lp_split'>
                    <div className='lp_wrap lp_split_grid'>
                        <div className='lp_panel'>
                            <h2>For residents</h2>
                            <p>Ask for help once. You never have to repeat your story to another office.</p>
                            <div className='lp_phone' aria-hidden='true'>
                                <div className='lp_msg'><b>Visit confirmed</b>Maria Alvarez will visit you Thursday at 2:00 pm.</div>
                                <div className='lp_msg lp_msg_soft'><b>Reminder</b>Your visit is tomorrow. Reply to reschedule.</div>
                            </div>
                            <ul>
                                <li>Submit a request in a few minutes</li>
                                <li>See who is helping and when they arrive</li>
                            </ul>
                        </div>
                        <div className='lp_panel lp_panel_dark'>
                            <h2>For care teams</h2>
                            <p>Requests, clients, visits and reports in one place, so nothing is lost between handoffs.</p>
                            <div className='lp_table' aria-hidden='true'>
                                <div className='lp_row lp_row_head'><span>Request</span><span>Worker</span><span>Status</span></div>
                                <div className='lp_row'><span>Housing application</span><span>M. Alvarez</span><em className='s_gold'>Assigned</em></div>
                                <div className='lp_row'><span>Prescription pickup</span><span>J. Okafor</span><em className='s_green'>Visited</em></div>
                                <div className='lp_row'><span>Food assistance</span><span>Unassigned</span><em className='s_gray'>New</em></div>
                            </div>
                            <ul>
                                <li>Assign requests and balance caseloads</li>
                                <li>Export reports for funders and partners</li>
                            </ul>
                        </div>
                    </div>
                </section>

                <section className='lp_how' id='how'>
                    <div className='lp_wrap'>
                        <div className='lp_head'>
                            <h2>From first request to closed case</h2>
                            <p>Every request follows the same four steps, so residents know what happens next and teams know who owns it.</p>
                        </div>
                        <ol className='lp_steps'>
                            {steps.map((s, i) => (
                                <li key={s.t}>
                                    <span className='lp_n'>{i + 1}</span>
                                    <div>
                                        <h3>{s.t}</h3>
                                        <p>{s.d}</p>
                                    </div>
                                </li>
                            ))}
                        </ol>
                    </div>
                </section>

                <section className='lp_tools'>
                    <div className='lp_wrap'>
                        <div className='lp_head'>
                            <h2>Everything a field team needs, in one workspace</h2>
                        </div>
                        <div className='lp_bento'>
                            <div className='lp_tile lp_tile_wide'>
                                <h3>Visit calendar</h3>
                                <p>See every scheduled visit by worker, client or day.</p>
                                <div className='lp_week' aria-hidden='true'>
                                    {days.map((d, i) => (
                                        <div key={d}>
                                            <span>{d}</span>
                                            {visits[i].map(v => <i key={v} className={v.endsWith('*') ? 'alt' : ''}>{v.replace('*', '')}</i>)}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className='lp_tile'>
                                <h3>Client records</h3>
                                <p>Goals, history and notes stay with the client.</p>
                                <div className='lp_card' aria-hidden='true'>
                                    <b>Daniel Reyes</b>
                                    <span>Goal: stable housing</span>
                                    <div className='lp_bar'><i style={{ width: '60%' }} /></div>
                                </div>
                            </div>
                            <div className='lp_tile'>
                                <h3>Automatic reminders</h3>
                                <p>Email nudges go out before visits and follow-ups.</p>
                                <div className='lp_card' aria-hidden='true'>
                                    <b>Sent 24 hours before</b>
                                    <span>Visit with Maria, Thu 2:00 pm</span>
                                </div>
                            </div>
                            <div className='lp_tile lp_tile_wide lp_tile_gold'>
                                <h3>Reports that are ready when you are</h3>
                                <p>Filter by date, worker or request type and export to CSV.</p>
                                <div className='lp_chips' aria-hidden='true'><span>Last 30 days</span><span>All workers</span><span>Export CSV</span></div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className='lp_cta'>
                    <div className='lp_wrap'>
                        <h2>Need help, or know someone who does?</h2>
                        <p>Send a request today. A Community Health Worker will contact you.</p>
                        <button className='lp_btn lp_btn_gold' onClick={request}>Request support</button>
                    </div>
                </section>
            </main>
            <footer className='footer_main'>
                <Footer />
            </footer>
        </>
    )
}

export default LandingPage
