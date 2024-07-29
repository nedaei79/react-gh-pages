import { useState } from "react";
import "./App.css";
import GameView from "./GameView";
import GetUrlsView from "./GetUrlsView";

function App() {
  const [urls, setUrls] = useState({
    player1: "http://0.0.0.0:8000/api/message/",
    player2: "http://0.0.0.0:8001/api/message/",
  });
  const [gotUrls, setGotUrls] = useState(false);

  return (
    <>
      {(!gotUrls || !urls.player1 || !urls.player2) && (
        <GetUrlsView setUrls={setUrls} setGotUrls={setGotUrls} />
      )}

      {gotUrls && urls.player1 && urls.player2 && <GameView urls={urls} />}
    </>
  );
}

export default App;
