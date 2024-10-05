import { useLocation } from 'react-router-dom'

function withLocation(Component) {
    return (props) => {
        return <Component {...props} location={useLocation()} />
    }
}

export default withLocation;