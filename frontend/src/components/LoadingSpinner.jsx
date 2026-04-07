function LoadingSpinner() {
  return (
    <div className="spinner-screen">
      <div className="spinner-card">
        <div className="spinner" aria-hidden="true" />
        <p>Checking your TrackJr session...</p>
      </div>
    </div>
  )
}

export default LoadingSpinner
