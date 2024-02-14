
function LoadingScreen() {
    return (
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',  display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
        <p>Loading...</p>
      </div>
    );
  }
  
  export default LoadingScreen;
  