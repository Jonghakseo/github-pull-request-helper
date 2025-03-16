export default function loadCollapsedComments() {
  // 접혀있는 댓글 내부의 데이터를 가져오기 위해 mouseenter 이벤트를 발생시킴
  const collapsedComments = Array.from(document.querySelectorAll('.review-thread-component > summary'));
  collapsedComments.forEach(item =>
    item.dispatchEvent(
      new MouseEvent('mouseenter', {
        view: window,
        bubbles: true,
        cancelable: true,
      }),
    ),
  );
}
