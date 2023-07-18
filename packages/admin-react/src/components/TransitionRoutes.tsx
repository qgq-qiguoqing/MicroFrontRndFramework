import { useTransition, animated } from '@react-spring/web'

import { useLocation } from 'react-router-dom'
const TransitionRoutes = ({ children }: any) => {
  const location = useLocation()

  const transitions = useTransition(location, {
    keys: null,
    from: { opacity: 0, transform: 'translate3d(100%,0,0)' },
    enter: { opacity: 1, transform: 'translate3d(0%,0,0)' },
    leave: { opacity: 0, transform: 'translate3d(-50%,0,0)' },
  })

  return (
    <>
      {transitions(({ opacity, transform }, item) => (
        <animated.div
          style={{
            opacity,
            transform,
            width: '100%',
            height: '100%',
            overflow: 'hidden',
          }}
          key={item.key}>
          {children}
        </animated.div>
      ))}
    </>
  )
}

export default TransitionRoutes
