import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

export default function App() {
  const [addfriend, setAddfreind] = useState(false);

  function handleaddfriend() {
    setAddfreind((show) => !show);
  }

  const [friends, setFriends] = useState(initialFriends);

  function Handleadd(friend) {
    setFriends((friends) => [...friends, friend]);
    setAddfreind(false);
  }

  const [selected, setSelected] = useState();

  function handleselection(f) {
    setSelected((cur) => (cur && cur.id === selected.id ? null : f));
    setAddfreind(false);
  }

  function SplitBill(value) {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selected.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );

    setSelected(null);
  }

  return (
    <>
      <h1 className="app-title">Restaurant Payment Bill App</h1>
      <div className="app">
        <div className="sidebar">
          <FriendList
            friends={friends}
            onSelection={handleselection}
            selected={selected}
          />

          {addfriend && <Addfriend onaddhandle={Handleadd} />}

          <Button onClick={handleaddfriend}>
            {addfriend ? "close" : "Add friend"}
          </Button>
        </div>

        {selected && (
          <Splitbill onSelected={selected} onSplitBill={SplitBill} />
        )}
      </div>
    </>
  );
}

function FriendList({ friends, onSelection, selected }) {
  return (
    <div>
      <ul>
        {friends.map((f) => (
          <Friend
            f={f}
            key={f.id}
            onSelection={onSelection}
            selected={selected}
          />
        ))}
      </ul>
    </div>
  );
}

function Friend({ f, onSelection, selected }) {
  const isselected = selected && selected.id === f.id;
  return (
    <div>
      <li className={isselected ? "select" : ""}>
        <img src={f.image} alt={f.name} />
        <h3>{f.name}</h3>
        {f.balance < 0 && (
          <p className="red">
            you owes to {f.name} {Math.abs(f.balance)}$
          </p>
        )}

        {f.balance > 0 && (
          <p className="green">
            {f.name} ows to you {Math.abs(f.balance)}$
          </p>
        )}

        {f.balance === 0 && (
          <p className="red">
            you and {f.name} are the even{Math.abs(f.balance)}$
          </p>
        )}
        <Button onClick={() => onSelection(f)}>
          {isselected ? "Close" : "select"}
        </Button>
      </li>
    </div>
  );
}

function Addfriend({ onaddhandle }) {
  const [fname, setFname] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function handlesubmit(e) {
    e.preventDefault();
    const id = crypto.randomUUID();

    if (!fname || !image) return;
    const newfriend = {
      fname,
      image: `${image}?=${id}`,
      balance: 0,
    };

    onaddhandle(newfriend);
    setFname("");
    setImage("https://i.pravatar.cc/48");
  }
  return (
    <form className="form-add-friend" onSubmit={handlesubmit}>
      <label> friend name</label>
      <input
        type="text"
        value={fname}
        onChange={(e) => setFname(e.target.value)}
      />
      <label>img url</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <Button> Add</Button>
    </form>
  );
}

function Splitbill({ onSelected, onSplitBill }) {
  const [bill, setBill] = useState("");
  const [paidbyuser, setPaidByuser] = useState("");
  const paidbyFriend = bill ? bill - paidbyuser : "";
  const [whoIsPaying, setWhoIsPaying] = useState("user");

  function handleSubmit(e) {
    e.preventDefault();

    if (!bill || !paidbyuser) return;
    onSplitBill(whoIsPaying === "user" ? paidbyuser : -paidbyuser);
  }
  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill with {onSelected.name}</h2>

      <label>Spilit a bill with {onSelected.name}</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />

      <label>your expences</label>
      <input
        type="text"
        value={paidbyuser}
        onChange={(e) =>
          setPaidByuser(
            Number(e.target.value) > bill ? paidbyuser : Number(e.target.value)
          )
        }
      />

      <label>{onSelected.name} expences</label>
      <input type="text" disabled value={paidbyFriend} />

      <label> who pay</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="user">you</option>
        <option value="friend">{onSelected.name}</option>
      </select>
      <Button> Add</Button>
    </form>
  );
}
