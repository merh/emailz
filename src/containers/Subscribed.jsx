import caddy from '../images/cadillac.jpg'
import brewster from '../images/1935-Brewster-Drivers-Front-View-630x390.jpg'
import truckBack from '../images/Craigslist-Find-Classic-GM-Car-Hoard.jpg'
import collection from '../images/Craigslist-Find-Classic-GM-Car-Hoard-3.jpg'

export default function Subscribed() {

    return (
        <>
            <div className="flex-container">
                <div className="flex-item one-third padded margined" id="signup">
                    <h2 className="haggard-font">You did it!</h2>
                    <p>Prepare for GLORY coming to your email soon!</p>
                </div>
                <div className="flex-item two-thirds padded margined columned">
                    <img src={caddy} alt="Beater Cadillac" className="vh-restricted" />
                    <img src={brewster} alt="1935 Brewseter" className="vh-restricted" />
                    <img src={truckBack} alt="Back of truck" className="vh-restricted" />
                    <img src={collection} alt="Collection of classics" className="vh-restricted" />
                </div>
            </div>
        </>
    )
}
