import React from 'react';

const ActivityLog = ({ log, clearLog }) => {
    return (
        <section id="activity-log-section">
            <h2>Activity Log</h2>
            <table id="activity-log">
                <thead>
                    <tr>
                        <th>Timestamp</th>
                        <th>Product</th>
                        <th>Quantity Change</th>
                    </tr>
                </thead>
                <tbody>
                    {log.map((entry, index) => (
                        <tr key={index}>
                            <td>{entry.timestamp}</td>
                            <td>{entry.product}</td>
                            <td>{entry.quantityChange}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button id="clear-activity-log" onClick={clearLog}>Clear Activity Log</button>
        </section>
    );
};

export default ActivityLog;
