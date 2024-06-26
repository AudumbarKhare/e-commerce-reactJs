import { useNavigate } from 'react-router-dom';

function withNavigate(Component) {
    return (props) => {
        return <Component {...props} navigate={useNavigate()} />
    }
}

export default withNavigate;