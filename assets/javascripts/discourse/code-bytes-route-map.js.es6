export default function () {
  this.route('code-bytes', function () {
    this.route('actions', function () {
      this.route('show', { path: '/:id' });
    });
  });
}
