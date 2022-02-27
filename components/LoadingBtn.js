const LoadingBtn = ({ type, children, className, onClick, loading, borderColor }) => {
    
    return (
      <button
        type={type}
        onClick={onClick}
        className={`flex items-center justify-center gap-2 transition ${className}`}
      >
        {children}
        {loading && <Loader borderColor={borderColor}/>}
      </button>
    );
}

export default LoadingBtn


export const Loader = ({borderColor}) => (
  <div
    className={`h-4 w-4 border-[2px] border-b-transparent rounded-full animate-spin ${borderColor|| 'border-white'}`}
  ></div>
);