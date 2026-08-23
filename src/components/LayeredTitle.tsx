export function LayeredTitle({ text, className }: { text: string; className?: string }) {
  return (
    <span className={className ? `layered-title ${className}` : 'layered-title'} aria-label={text}>
      <span className="layered-title-stage" aria-hidden="true">
        {Array.from({ length: 14 }, (_, index) => (
          <span className="layered-title-layer" data-text={text} key={index} />
        ))}
      </span>
    </span>
  )
}
