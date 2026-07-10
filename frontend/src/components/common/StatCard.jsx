import "./StatCard.css";

export default function StatCard({
    title,
    value,
    icon,
    color
}) {

    return (

        <div
            className="stat-card"
            style={{
                borderTop: `6px solid ${color}`
            }}
        >

            <div className="stat-card-header">

                <div className="stat-icon">

                    {icon}

                </div>

            </div>

            <div className="stat-card-body">

                <h3>

                    {title}

                </h3>

                <h1>

                    {value}

                </h1>

            </div>

        </div>

    );

}