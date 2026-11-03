import React, { useEffect, useRef } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import Header from '../../components/common/Header'
import Footer from '../../components/common/Footer'
import { PATH_LIST } from '../../constant/path-list'
import heroPhoto from '../../assets/images/hero_banner.png'
import foodPhoto from '../../assets/images/event1.jpg'
import volunteerPhoto from '../../assets/images/slide_img1.png'
import waterfall from '../../assets/images/Landing-Page-Image.jpg'
import "./style.scss"

const steps = [
    { t: 'Ask', d: 'A resident describes what they need in their own words, by form or by phone.' },
    { t: 'Review', d: 'A coordinator checks the request, sets priority and adds missing details.' },
    { t: 'Assign', d: 'The request goes to the Community Health Worker closest to the need.' },
    { t: 'Follow up', d: 'Visits, goals and reminders are tracked until the need is closed.' },
]

const LandingPage = () => {
    const token = localStorage.getItem("token")
    const navigate = useNavigate()
    const root = useRef(null)

    // fade sections in as they enter the viewport (hierarchy cue); skipped for reduced motion
    useEffect(() => {
        const els = root.current?.querySelectorAll('.rv')
        if (!els) return
        if (matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
            els.forEach(e => e.classList.add('in'))
            return
        }
        const io = new IntersectionObserver(entries => entries.forEach(e => {
            if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) }
        }), { threshold: 0.15 })
        els.forEach(e => io.observe(e))
        return () => io.disconnect()
    }, [])

    if (token) return <Navigate to={PATH_LIST.user.dashboard} />
    const request = () => navigate(PATH_LIST.onBoarding)

    return (
        <>
            <Header navigate={navigate} />
            <main className='lp' ref={root}>
                <section className='lp_hero'>
                    <div className='lp_wrap lp_hero_grid'>
                        <div className='lp_hero_copy'>
                            <h1>Help finds its way to the right door.</h1>
                            <p className='lp_lead'>CareBridge routes every community request to a Community Health Worker and follows up until the need is met.</p>
                            <div className='lp_actions'>
                                <button className='lp_btn lp_btn_gold' onClick={request}>Request support</button>
                                <a className='lp_btn lp_btn_ghost' href='#how'>How it works</a>
                            </div>
                        </div>
                        <div className='lp_collage'>
                            <img className='lp_photo_main' src={heroPhoto} alt='Community health workers and neighbors gathered on a rooftop' width='492' height='332' />
                            <img className='lp_photo_side' src={foodPhoto} alt='A health worker handing out boxed meals at a food distribution' width='380' height='250' />
                        </div>
                    </div>
                </section>

                <section className='lp_audience'>
                    <div className='lp_wrap'>
                        <h2 className='rv'>Built for the people asking and the people answering.</h2>
                        <div className='lp_audience_grid'>
                            <article className='lp_card_res rv'>
                                <img src={volunteerPhoto} alt='Volunteers sorting donated supplies' width='388' height='251' />
                                <div>
                                    <h3>For residents</h3>
                                    <p>Ask for help once. You never repeat your story to another office, and you always know who is coming and when.</p>
                                    <button className='lp_link' onClick={request}>Request support</button>
                                </div>
                            </article>
                            <article className='lp_card_team rv'>
                                <h3>For care teams</h3>
                                <p>Requests, clients, visits and reports in one workspace, so nothing is lost between handoffs.</p>
                                <ul>
                                    <li>Assign requests and balance caseloads</li>
                                    <li>Track every visit, goal and follow-up</li>
                                    <li>Export reports for funders and partners</li>
                                </ul>
                                <button className='lp_btn lp_btn_gold' onClick={() => navigate(PATH_LIST.login)}>Team log in</button>
                            </article>
                        </div>
                    </div>
                </section>

                <section className='lp_how' id='how'>
                    <div className='lp_wrap'>
                        <h2 className='rv'>From first request to closed case.</h2>
                        <ol className='lp_steps'>
                            {steps.map((s, i) => (
                                <li key={s.t} className='rv' style={{ transitionDelay: `${i * 90}ms` }}>
                                    <span className='lp_n'>{i + 1}</span>
                                    <h3>{s.t}</h3>
                                    <p>{s.d}</p>
                                </li>
                            ))}
                        </ol>
                    </div>
                </section>

                <section className='lp_tools'>
                    <div className='lp_wrap'>
                        <h2 className='rv'>Everything a field team needs in one workspace.</h2>
                        <div className='lp_bento'>
                            <div className='lp_tile lp_t_photo rv'>
                                <h3>Visit calendar</h3>
                                <p>See every scheduled visit by worker, client or day.</p>
                            </div>
                            <div className='lp_tile lp_t_spruce rv'>
                                <h3>Client records</h3>
                                <p>Goals, history and notes stay with the client.</p>
                            </div>
                            <div className='lp_tile lp_t_mist rv'>
                                <h3>Automatic reminders</h3>
                                <p>Email nudges go out before visits and follow-ups.</p>
                            </div>
                            <div className='lp_tile lp_t_line rv'>
                                <h3>Reports on demand</h3>
                                <p>Filter by date, worker or request type, then export to CSV.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className='lp_cta' style={{ backgroundImage: `linear-gradient(100deg, rgba(15,61,58,.94) 30%, rgba(15,61,58,.55)), url(${waterfall})` }}>
                    <div className='lp_wrap rv'>
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
