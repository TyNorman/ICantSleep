import './PlaylistItem.css'
import noArt from '../assets/audio/snes/NoArt.png';

const PlaylistItem = ({ title, game, art}) => {

  if (art != noArt)
    art = '/src/assets/audio/'+art || noArt;

  return (
    <div className="playlist">
      <img src={art} alt={`${game}`} />
      <div className="songText">
        <div className="title">{title}</div>
        <div className="game">{game}</div>
      </div>
    </div>
  );

}

export { PlaylistItem }