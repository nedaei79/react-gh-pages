export default function GetUrlsView({ setUrls, setGotUrls }) {
  return (
    <div
      style={{
        width: "100%",
        backgroundColor: "lightyellow",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <input
        onChange={(event) =>
          setUrls((prev) => ({ ...prev, player1: event.target.value }))
        }
      />
      <input
        onChange={(event) =>
          setUrls((prev) => ({ ...prev, player2: event.target.value }))
        }
      />
      <button onClick={() => setGotUrls(true)}>start</button>
    </div>
  );
}
