const brandStyles = `flex items-center justify-center !text-xs mb-0 mt-2 select-none`;

export default function BrandingBar() {
  return (
    <div className={`${brandStyles}`}>
      <span className="text-gray-600 ml-1">POOLHALL</span>
      <span className="text-gray-400">MASTER</span>
      <span className="text-gray-600 ml-2">2025</span>
    </div>
  )
}
