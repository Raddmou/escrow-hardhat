export default function Escrow({
  address,
  arbiter,
  beneficiary,
  value,
  handleApprove,
  handleReject
}) {
  return (
    <div className="existing-contract">
      <ul className="fields">
        <li>
          <div> Arbiter </div>
          <div> {arbiter} </div>
        </li>
        <li>
          <div> Beneficiary </div>
          <div> {beneficiary} </div>
        </li>
        <li>
          <div> Value </div>
          <div> {value} </div>
        </li>
        <div
          className="button"
          data-address={address}
          onClick={(e) => {
            e.preventDefault();

            handleApprove();
          }}
        >
          Approve
        </div>
        <div
          className="button"
          data-address={address}
          onClick={(e) => {
            e.preventDefault();

            handleReject();
          }}
        >
          Reject
        </div>
      </ul>
    </div>
  );
}
